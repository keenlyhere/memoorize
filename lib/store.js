import { combineSlices, configureStore } from '@reduxjs/toolkit';
import userSlice from './features/users/userSlice';

const rootReducer = combineSlices({
  user: userSlice,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
}
