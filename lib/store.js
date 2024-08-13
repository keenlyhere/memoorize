import { combineSlices, configureStore } from '@reduxjs/toolkit';
import userSlice from './features/users/userSlice';
import coursesSlice from './features/courses/coursesSlice';

const rootReducer = combineSlices({
  user: userSlice,
  courses: coursesSlice,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
}
