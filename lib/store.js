import { combineSlices, configureStore } from '@reduxjs/toolkit';
import userSlice from './features/users/userSlice';
import coursesSlice from './features/courses/coursesSlice';
import flashcardSetsSlice from './features/flashcardSets/flashcardSetsSlice';
import flashcardsSlice from './features/flashcards/flashcardsSlice';
import studySessionsSlice from './features/studySessions/studySessionsSlice';

const rootReducer = combineSlices({
  user: userSlice,
  courses: coursesSlice,
  flashcardSets: flashcardSetsSlice,
  flashcards: flashcardsSlice,
  sessions: studySessionsSlice,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
}
