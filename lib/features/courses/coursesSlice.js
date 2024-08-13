import { db } from '@/firebase';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addDoc, collection } from 'firebase/firestore';

// thunk to add course
export const addCourse = createAsyncThunk(
  'courses/addCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error('Failed to add course');
      }

      const result = await response.json();
      return result;
    } catch (error) {
        return rejectWithValue(error.message);
    }
  }
);

// thunk to delete course
export const removeCourse = createAsyncThunk(
  'courses/removeCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'Courses', courseId));
      return courseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to edit course
export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, ...courseData }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'Courses', id);
      await updateDoc(docRef, courseData);
      return { id, ...courseData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  courses: [],
  status: 'idle',
  error: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(course => course.id !== action.payload);
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })
      .addCase(removeCourse.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default coursesSlice.reducer;
