import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authorizeAxios from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constant";
const initialState = {
  currentUser: null,
};
export const loginUserApi = createAsyncThunk(
  "user/loginUserApi",
  async (data) => {
    const response = await authorizeAxios.post(
      `${API_ROOT}/v1/users/login`,
      data
    );
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUserApi.fulfilled, (state, action) => {
      const userInfo = action.payload;
      state.currentUser = userInfo;
    });
  },
});
// export const {} = userSlice.actions;
export const selectCurrentUser = (state) => {
  return state.user.currentUser;
};

export const userReducer = userSlice.reducer;
