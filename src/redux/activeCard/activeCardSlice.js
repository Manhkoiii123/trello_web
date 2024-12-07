import { createSlice } from "@reduxjs/toolkit";
const initState = {
  currentActiveCard: null,
};
export const activeCardSlice = createSlice({
  name: "activeCard",
  initialState: initState,
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null;
    },
    updateCurrentActiveCard: (state, action) => {
      const fullcard = action.payload;
      state.currentActiveCard = fullcard;
    },
  },
  extraReducers: (builder) => {},
});
export const { clearCurrentActiveCard, updateCurrentActiveCard } =
  activeCardSlice.actions;
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard;
};
export const activeCardReducer = activeCardSlice.reducer;
