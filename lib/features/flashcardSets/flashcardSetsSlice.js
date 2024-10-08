import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addFlashcard, getFlashcards } from "../flashcards/flashcardsSlice";
import { db } from "@/firebase"; // Ensure you have access to the Firestore instance
import {
  collection,
  writeBatch,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { updateCourseSetCount } from "../courses/coursesSlice";

const normalize = (flashcards) => {
	const normalizedData = {};
	if (!flashcards.length) return flashcards;
	flashcards.forEach(flashcard => normalizedData[flashcard.id] = flashcard);
	return normalizedData;
}


// thunk to get all flashcard sets for a user
export const getAllFlashcardSets = createAsyncThunk(
  "flashcardSets/getAllFlashcardSets",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/flashcardSets/allFlashcardSets?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch flashcard sets");
      }

      const sets = await response.json();
      return sets;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to get all flashcard sets in a course
export const getCourseSets = createAsyncThunk(
  "flashcardSets/fetchCourseSets",
  async ({ courseId, userId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/flashcardSets?courseId=${courseId}&userId=${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flashcard sets");
      }

      const data = await response.json();

      let allFlashcards;

      if (data.sets.length) {
        const allFlashcardsPromise = data.sets.map(set => dispatch(getFlashcards({ setId: set.id, userId })).unwrap().then(result => ({ [set.id]: normalize(result.flashcards) })));
        const resolvedFlashcards = await Promise.all(allFlashcardsPromise);

        // combine the flashcards into one object
        allFlashcards = resolvedFlashcards.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});
      }

      // add allFlashcards to the data object
      data.allFlashcards = allFlashcards;

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// thunk to add a new flashcard set
export const addFlashcardSet = createAsyncThunk(
  "flashcardSets/addFlashcardSet",
  async (
    { title, courseId, userId, aiGeneration, aiPrompt },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Step 1: Create the flashcard set
      const response = await fetch("/api/flashcardSets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, courseId, userId }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        return rejectWithValue(errorResponse.error);
      }

      const { newSet, updatedCourse } = await response.json();

      let generatedSet = null;

      // Step 2: If AI generation is enabled, generate flashcards using OpenAI
      if (aiGeneration) {
        const openAIResponse = await fetch("/api/generateFlashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: aiPrompt, setId: newSet.id, userId }),
        });

        if (!openAIResponse.ok) {
          throw new Error("Failed to generate flashcards using AI");
        }

        const generatedFlashcards = await openAIResponse.json();

        // Step 3: Batch write generated flashcards to Firestore
        // const batch = writeBatch(db);
        // const flashcardsCollection = collection(db, "Flashcards");

        // generatedFlashcards.forEach((flashcard) => {
        //   const flashcardRef = doc(flashcardsCollection);
        //   batch.set(flashcardRef, {
        //     ...flashcard,
        //     id: flashcardRef.id,
        //     createdAt: serverTimestamp(),
        //     updatedAt: serverTimestamp(),
        //   });
        // });

        // console.log('generatedFlashcards:', generatedFlashcards);

        // await batch.commit();

        let newSetId = newSet.id;
        generatedSet = {
          [newSetId]: generatedFlashcards.reduce((acc, obj) => {
            acc[obj.id] = obj;
            return acc;
          }, {})
        }
      }

      // Step 4: Update course's set count
      dispatch(updateCourseSetCount(updatedCourse));
      dispatch(getCourseSets({ courseId, userId }))

      if (generatedSet) {
        return { newSet, generatedSet }
      }

      return newSet;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to delete flashcard set
export const removeFlashcardSet = createAsyncThunk(
  "flashcardSets/removeFlashcardSet",
  async ({ setId, userId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/flashcardSets?id=${setId}&userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete flashcard set");
      }

      const { updatedCourse } = await response.json();

      // update course's set count (-1)
      dispatch(updateCourseSetCount(updatedCourse));

      return setId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to edit flashcard set
export const updateFlashcardSet = createAsyncThunk(
  "flashcardSets/updateFlashcardSet",
  async ({ id, title, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/flashcardSets`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flashcardSetId: id, title, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update flashcard set");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  sets: [],
  totalFlashcards: 0,
  allFlashcardsPerSet: {},
  status: "idle",
  error: null,
  allFlashcardSets:[],

};

const flashcardSetsSlice = createSlice({
  name: "flashcardSets",
  courseTitle: "",
  initialState,
  reducers: {
    updatedSetFlashcardCount(state, action) {
      const updatedSet = action.payload;
      const existingSet = state.sets.find(set => set.id === updatedSet.id)
      console.log('updatedSet:', updatedSet);
      console.log('existingSet:', existingSet);

      if (existingSet) {
        existingSet.flashcardCount = updatedSet.flashcardCount;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCourseSets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCourseSets.fulfilled, (state, action) => {
        state.flashcardSets = action.payload.sets;
        console.log('action.payload.sets:', action.payload);
        state.allFlashcardsPerSet = action.payload.allFlashcards;
        console.log('state.allFlashcardsPerSet:', state.allFlashcardsPerSet);
        state.courseTitle = action.payload.courseTitle;
        state.status = "succeeded";
      })
      .addCase(getCourseSets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllFlashcardSets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllFlashcardSets.fulfilled, (state, action) => {
        state.allFlashcardSets = action.payload;
        state.status = "succeeded";
      })
      .addCase(getAllFlashcardSets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addFlashcardSet.pending, (state) => {
        console.log('loading');
        state.status = "loading";
      })
      .addCase(addFlashcardSet.fulfilled, (state, action) => {
        if (action.payload.generatedSet) {
          let generatedSet = action.payload.generatedSet;
          console.log('generatedSet:', action.payload.generatedSet)
          state.allFlashcardsPerSet = { ...state.allFlashcardsPerSet, ...generatedSet };
          console.log('updated flashcardsPerSet:', state.allFlashcardsPerSet);
        }

        const existingFlashcardSet = state.flashcardSets.find(
          (set) => set.id === action.payload.newSet.id
        );
        console.log('addCardSet:', action.payload);
        if (!existingFlashcardSet) {
          state.flashcardSets.push(action.payload.newSet);
        }

        state.status = "succeeded";
      })
      .addCase(addFlashcardSet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeFlashcardSet.fulfilled, (state, action) => {
        state.flashcardSets = state.flashcardSets.filter(
          (set) => set.id !== action.payload
        );
      })
      .addCase(removeFlashcardSet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateFlashcardSet.fulfilled, (state, action) => {
        const index = state.flashcardSets.findIndex(
          (set) => set.id === action.payload.id
        );
        if (index !== -1) {
          state.flashcardSets[index] = action.payload;
        }
        state.status = "succeeded";
      })
      .addCase(updateFlashcardSet.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateFlashcardSet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default flashcardSetsSlice.reducer;
