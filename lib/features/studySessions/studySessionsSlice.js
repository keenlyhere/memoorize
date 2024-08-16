import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// thunk to get all study sessions for a user
export const getAllStudySessions = createAsyncThunk(
  "studySessions/getAllStudySessions",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/studySessions/getAllSessions?userId=${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch study sessions");
      }

      const sessions = await response.json();
      return sessions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to start a study session
export const startStudySession = createAsyncThunk(
  "studySessions/startStudySession",
  async ({ userId, setId, courseId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/studySessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, setId, courseId }),
      });

      if (!response.ok) {
        throw new Error("Failed to start study session");
      }

      const session = await response.json();
      return session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to resume a paused study session
export const resumeStudySession = createAsyncThunk(
  "studySessions/resumeStudySession",
  async ({ sessionId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/studySessions/${sessionId}/resume`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to resume study session");
      }

      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to end a study session
export const endStudySession = createAsyncThunk(
  "studySessions/endStudySession",
  async ({ sessionId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/studySessions/${sessionId}/end`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to end study session");
      }

      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to update a study session
export const updateStudySession = createAsyncThunk(
  "studySessions/updateStudySession",
  async (
    { sessionId, flashcardId, difficulty, reviewTime, currentFlashcardIndex },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/studySessions/${sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcardId,
          difficulty,
          reviewTime,
          currentFlashcardIndex,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update study session");
      }

      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to get active study session
export const getActiveStudySession = createAsyncThunk(
  "studySessions/getActiveStudySession",
  async ({ userId, setId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/studySessions?userId=${userId}&setId=${setId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch active study session");
      }

      const session = await response.json();
      return session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  sessions: [], // Adding sessions to the initial state
  session: null,
  status: "idle",
  error: null,
};

const studySessionsSlice = createSlice({
  name: "studySessions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllStudySessions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllStudySessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
        state.status = "succeeded";
      })
      .addCase(getAllStudySessions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(startStudySession.fulfilled, (state, action) => {
        state.session = action.payload;
        state.status = "succeeded";
      })
      .addCase(resumeStudySession.fulfilled, (state, action) => {
        state.session = action.payload;
        state.status = "succeeded";
      })
      .addCase(endStudySession.fulfilled, (state) => {
        state.session = null;
        state.status = "succeeded";
      })
      .addCase(updateStudySession.fulfilled, (state, action) => {
        state.session = action.payload;
        state.status = "succeeded";
      })
      .addCase(getActiveStudySession.fulfilled, (state, action) => {
        state.session = action.payload;
        state.status = "succeeded";
      })
      .addCase(
        startStudySession.rejected,
        resumeStudySession.rejected,
        endStudySession.rejected,
        updateStudySession.rejected,
        getActiveStudySession.rejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export default studySessionsSlice.reducer;
