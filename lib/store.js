import { combineSlices, configureStore } from '@reduxjs/toolkit';
import userSlice from './features/users/userSlice';
import coursesSlice from './features/courses/coursesSlice';
import flashcardSetsSlice from './features/courses/flashcardSetsSlice';

const rootReducer = combineSlices({
  user: userSlice,
  courses: coursesSlice,
  flashcardSets: flashcardSetsSlice,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
}
