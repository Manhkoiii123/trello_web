import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authorizeAxios from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constant";

const initialState = {
  currentNotifications: null,
};
export const fetchInvitationAPI = createAsyncThunk(
  "notifications/fetchInvitationAPI",
  async () => {
    const response = await authorizeAxios.get(`${API_ROOT}/v1/invitations`);
    return response.data;
  }
);
export const updateBoardInvitationApi = createAsyncThunk(
  "notifications/updateBoardInvitationApi",
  async ({ status, invitationId }) => {
    const response = await authorizeAxios.put(
      `${API_ROOT}/v1/invitations/board/${invitationId}`,
      { status }
    );
    return response.data;
  }
);
export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null;
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload;
    },
    addNotification: (state, action) => {
      state.currentNotifications.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload;
      state.currentNotifications = Array.isArray(incomingInvitation)
        ? incomingInvitation.reverse()
        : [];
    });

    builder.addCase(updateBoardInvitationApi.fulfilled, (state, action) => {
      const incomingInvitation = action.payload;
      const getInvitation = state.currentNotifications.find(
        (item) => item._id === incomingInvitation._id
      );
      getInvitation.boardInvitation = incomingInvitation.boardInvitation;
    });
  },
});
export const {
  addNotification,
  clearCurrentNotifications,
  updateCurrentNotifications,
} = notificationsSlice.actions;
export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications;
};

export const notificationsReducer = notificationsSlice.reducer;
