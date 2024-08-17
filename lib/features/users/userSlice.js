import { useUser } from '@clerk/nextjs';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getSubscriptionPlan = createAsyncThunk(
  "users/getSubscriptionPlan",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/subscription?userId=${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch study sessions");
      }

      const subscriptionData = await response.json();
      return subscriptionData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  id: null,
  fullName: null,
  firstName: null,
  email: null,
  avatar: null,
  subscriptionPlanName: null,
  subscriptionPlanId: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(getSubscriptionPlan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSubscriptionPlan.fulfilled, (state, action) => {
        state.subscriptionPlanId = action.payload.subscriptionPlanId;
        state.subscriptionPlanName = action.payload.subscriptionPlanName;
        state.status = "succeeded";
      })
      .addCase(getSubscriptionPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

export const getUser = async () => (dispatch) => {
	const { user } = useUser();

	if (user) {
    dispatch(getSubscriptionPlan(user.id));
		return dispatch(user);
	}
}
