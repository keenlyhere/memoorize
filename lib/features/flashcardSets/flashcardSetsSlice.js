import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// thunk to get all flashcard sets in a course
export const getCourseSets = createAsyncThunk(
	"flashcardSets/fetchCourseSets",
	async ({ courseId, userId }, { rejectWithValue }) => {
		try {
			const response = await fetch(`/api/flashcardSets?courseId=${courseId}&userId=${userId}`);

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
	async ({ title, courseId, userId }, { rejectWithValue }) => {
		try {
			const response = await fetch("/api/flashcardSets", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ title, courseId, userId }),
			});

			if (!response.ok) {
				throw new Error("Failed to add flashcard set");
			}

			const newSet = await response.json();
			return newSet;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// thunk to delete flashcard set
export const removeFlashcardSet = createAsyncThunk(
	"flashcardSets/removeFlashcardSet",
	async ({ setId, userId }, { rejectWithValue }) => {
		try {
			const response = await fetch(`/api/flashcardSets?id=${setId}&userId=${userId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete flashcard set");
			}

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
	status: "idle",
	error: null,
};

const flashcardSetsSlice = createSlice({
	name: "flashcardSets",
	courseTitle: '',
	initialState,
	reducers: {},
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
				const existingFlashcardSet = state.flashcardSets.find((set) => set.id === action.payload.id);
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
				state.flashcardSets = state.flashcardSets.filter((set) => set.id !== action.payload);
			})
			.addCase(removeFlashcardSet.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(updateFlashcardSet.fulfilled, (state, action) => {
				const index = state.flashcardSets.findIndex((set) => set.id === action.payload.id);
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
