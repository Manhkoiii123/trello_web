import { createSlice } from "@reduxjs/toolkit";
//khởi tạo state trong redux
const initialState = {
  currentActiveBoard: null,
};

export const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,
  //reducer là nơi xử lí dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      //action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gắn nó ra 1 biến có nghĩa hơn(fullBoard)
      const fullBoard = action.payload;
      //xử lí dữ liệu vào reducer
      // ...
      // update dữ liệu vào reducer
      state.currentActiveBoard = fullBoard;
    },
  },
});
// actions là nơi dành cho các component dưới gọi bằng dispatch tới nó để update lại dữ liệu thông qua reducer (chạy đồng bộ)
// actions này là do redux tự tạo ra
export const { updateCurrentActiveBoard } = activeBoardSlice.actions;
//selectors: để lấy dữ liệu từ redux ra (có thể lấy từ bên component cũng được) => call bằng useSelector()
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard;
};

// export default activeBoardSlice.reducer;
export const activeBoardReducer = activeBoardSlice.reducer;
