import { createSlice } from "@reduxjs/toolkit";
const initState = {
  currentActiveCard: null,
  isShowModalActiveCard: false,
};
export const activeCardSlice = createSlice({
  name: "activeCard",
  initialState: initState,
  reducers: {
    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null;
      state.isShowModalActiveCard = false;
    },
    updateCurrentActiveCard: (state, action) => {
      const fullcard = action.payload;
      state.currentActiveCard = fullcard;
    },
    showModalActiveCard: (state, action) => {
      state.isShowModalActiveCard = true;
    },
  },
  extraReducers: (builder) => {},
});
export const {
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard,
  showModalActiveCard,
} = activeCardSlice.actions;
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard;
};
export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard;
};
export const activeCardReducer = activeCardSlice.reducer;
