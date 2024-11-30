import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
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
export const logoutUserApi = createAsyncThunk(
  "user/logoutUserApi",
  async (showMessage = true) => {
    const response = await authorizeAxios.delete(`${API_ROOT}/v1/users/logout`);
    if (showMessage) {
      toast.success("Logged out successfully");
    }
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
    builder.addCase(logoutUserApi.fulfilled, (state) => {
      state.currentUser = null;
    });
  },
});
// export const {} = userSlice.actions;
export const selectCurrentUser = (state) => {
  return state.user.currentUser;
};

export const userReducer = userSlice.reducer;
