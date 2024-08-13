import { useUser } from '@clerk/nextjs';
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: null,
  fullName: null,
  firstName: null,
  email: null,
  avatar: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.fullName = action.payload.fullName;
      state.firstName = action.payload.firstName;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

export const getUser = async () => (dispatch) => {
	const { user } = useUser();

	if (user) {
		return dispatch(user);
	}
}
