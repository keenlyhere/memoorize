import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// thunk to get all flashcards in flashcard set
export const getFlashcards = createAsyncThunk(
	"flashcards/getFlashcards",
	async ({ setId, userId }, { rejectWithValue }) => {
		try {
			const response = await fetch(`/api/flashcards?setId=${setId}&userId=${userId}`);

			if (!response.ok) {
				throw new Error("Failed to fetch flashcards");
			}

            const flashcards = await response.json();
			return flashcards;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// thunk to get a single flashcard by its ID
export const getSingleCard = createAsyncThunk(
    "flashcards/getSingleCard",
    async ({ flashcardId }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/flashcards/${flashcardId}?userId=${userId}`);

            if (!response.ok) {
                throw new Error("Failed to fetch flashcard");
            }

            const flashcard = await response.json();
            return flashcard;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// thunk to add a new flashcard
export const addFlashcard = createAsyncThunk(
    "flashcards/addFlashcard",
    async (flashcardData, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/flashcards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(flashcardData),
            });

            if (!response.ok) {
                throw new Error("Failed to add flashcard");
            }

            const newFlashcard = await response.json();
            return newFlashcard;
        } catch (error) {
            return rejectWithValue(error.message);
        }
});

// thunk to delete flashcard
export const removeFlashcard = createAsyncThunk(
	"flashcards/removeFlashcard",
	async ({ flashcardId, userId }, { rejectWithValue }) => {
		try {
			const response = await fetch(`/api/flashcards?id=${flashcardId}&userId=${userId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
                throw new Error("Failed to delete flashcard");
            }

			return flashcardId;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// thunk to edit flashcard
export const updateFlashcard = createAsyncThunk(
	"flashcards/updateFlashcard",
	async (flashcardData, { rejectWithValue }) => {
		try {
			const response = await fetch(`/api/flashcards`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(flashcardData),
			});

			if (!response.ok) {
                throw new Error("Failed to update flashcard");
            }

            const result = await response.json();
			return result;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const initialState = {
	flashcards: [],
	status: "idle",
	error: null,
};

const flashcardsSlice = createSlice({
	name: "flashcards",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getFlashcards.pending, (state) => {
				state.status = "loading";
			})
			.addCase(getFlashcards.fulfilled, (state, action) => {
				state.flashcards = action.payload;
				state.status = "succeeded";
			})
			.addCase(getFlashcards.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})

			//getSingleCard
			.addCase(getSingleCard.pending, (state) => {
				state.status = "loading";
			})
			.addCase(getSingleCard.fulfilled, (state, action) => {
				const index = state.flashcards.findIndex(flashcard => flashcard.id === action.payload.id);
				if (index === -1) {
					state.flashcards.push(action.payload);
				} else {
					state.flashcards[index] = action.payload;
				}
				state.status = "succeeded";
			})
			.addCase(getSingleCard.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			//

			.addCase(addFlashcard.pending, (state) => {
				state.status = "loading";
			})
            .addCase(addFlashcard.fulfilled, (state, action) => {
				state.flashcards.push(action.payload);
				state.status = "succeeded";
			})
            .addCase(addFlashcard.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(removeFlashcard.fulfilled, (state, action) => {
				state.flashcards = state.flashcards.filter((flashcard) => flashcard.id !== action.payload);
			})
            .addCase(removeFlashcard.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(updateFlashcard.fulfilled, (state, action) => {
				const index = state.flashcards.findIndex((flashcard) => flashcard.id === action.payload.id);
				if (index !== -1) {
                    state.flashcards[index] = action.payload;
                }
				state.status = "succeeded";
			})
            .addCase(updateFlashcard.pending, (state) => {
				state.status = "loading";
			})
            .addCase(updateFlashcard.rejected, (state) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export default flashcardsSlice.reducer;
