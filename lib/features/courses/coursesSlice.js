import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// thunk to get all courses
export const getUserCourses = createAsyncThunk(
  'courses/fetchUserCourses',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/courses?userId=${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to get a single course
export const getSingleCourse = createAsyncThunk(
  'courses/getSingleCourse',
  async (courseId, { rejectWithValue }) => {
    try {

      const response = await fetch(`/api/course/${courseId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/courses/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      return courseData.courseId;
    } catch (error) {
      console.log('error deleting course:', error);
      return rejectWithValue(error.message);
    }
  }
);

// thunk to edit course
export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, title }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: id, title }),
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      const updatedCourse = await response.json();
      return updatedCourse;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to update course's set count
export const updateCourseSetCount = createAsyncThunk(
  'courses/updateCourseSetCount',
  async ({ courseId, increment }, { getState, rejectWithValue }) => {
    try {
      const { courses } = getState().courses;
      const course = courses.find((course) => course.id === courseId);

      if (!course) {
        throw new Error('Course not found');
      }

      const updatedSetCount = (course.setCount || 0) + increment;

      const response = await fetch(`/api/courses`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId, setCount: updatedSetCount }),
      });

      if (!response.ok) {
        throw new Error('Failed to update course set count');
      }

      const updatedCourse = await response.json();
      return updatedCourse;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  courses: [],
  totalSets: 0,
  status: 'idle',
  error: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    updateCourseSetCount(state, action) {
      const updatedCourse = action.payload;
      const existingCourse = state.courses.find(course => course.id === updatedCourse.id);

      if (existingCourse) {
        existingCourse.setCount = updatedCourse.setCount;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.totalSets = action.payload.reduce((acc, course) => acc + (course.setCount || 0), 0)
        state.status = 'succeeded';
      })
      .addCase(getUserCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      //singleCourse
      .addCase(getSingleCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSingleCourse.fulfilled, (state, action) => {
        state.currCourse = action.payload; // set currCourse here to retreive directly
        state.status = 'succeeded';
      })
      .addCase(getSingleCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      //
      .addCase(addCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        const existingCourse = state.courses.find(course => course.id === action.payload.id);
        if (!existingCourse) {
          state.courses.push(action.payload);
        }
        state.status = 'succeeded';
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(course => course.id !== action.payload);
      })
      .addCase(removeCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        state.status = 'succeeded';
      })
      .addCase(updateCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default coursesSlice.reducer;
