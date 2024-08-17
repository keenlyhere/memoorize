import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addFlashcard } from "../flashcards/flashcardsSlice";
import { db } from "@/firebase"; // Ensure you have access to the Firestore instance
import {
  collection,
  writeBatch,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { updateCourseSetCount } from "../courses/coursesSlice";

// thunk to get all flashcard sets in a course
export const getCourseSets = createAsyncThunk(
  "flashcardSets/fetchCourseSets",
  async ({ courseId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/flashcardSets?courseId=${courseId}&userId=${userId}`
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
        const batch = writeBatch(db);
        const flashcardsCollection = collection(db, "Flashcards");

        generatedFlashcards.forEach((flashcard) => {
          const flashcardRef = doc(flashcardsCollection);
          batch.set(flashcardRef, {
            ...flashcard,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });

        await batch.commit();
      }

      // Step 4: Update course's set count
      dispatch(updateCourseSetCount(updatedCourse));

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
  status: "idle",
  error: null,
};

const flashcardSetsSlice = createSlice({
  name: "flashcardSets",
  courseTitle: "",
  initialState,
  reducers: {
    updatedSetFlashcardCount(state, action) {
      const updatedSet = action.payload;
      const existingSet = state.sets.find(set => set.id === updatedSet.id)

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
        state.courseTitle = action.payload.courseTitle;
        state.status = "succeeded";
      })
      .addCase(getCourseSets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addFlashcardSet.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addFlashcardSet.fulfilled, (state, action) => {
        const existingFlashcardSet = state.flashcardSets.find(
          (set) => set.id === action.payload.id
        );
        console.log('addCardSet:', action.payload);
        if (!existingFlashcardSet) {
          state.flashcardSets.push(action.payload);
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
