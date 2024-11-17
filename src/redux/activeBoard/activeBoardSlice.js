import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { isEmpty } from "lodash";
import { API_ROOT } from "~/utils/constant";
import { generatePlaceholderCard } from "~/utils/formaters";
import { mapOrder } from "~/utils/sort";
//khởi tạo state trong redux
const initialState = {
  currentActiveBoard: null,
};
//các hành động call api bên redux => extra reducer => middle createAsyncThunk
export const fetchBoardDetailsAPI = createAsyncThunk(
  "activeBoard/fetchBoardDetailsAPI",
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
    return response.data;
  }
);

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
  //thêm 1 middleware để xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      let fullBoard = action.payload;
      // xử lí dữ liệu như bên _id phần fetchBoardDetailsAPI (useEffect)
      fullBoard.columns = mapOrder(
        fullBoard.columns,
        fullBoard.columnOrderIds,
        "_id"
      );
      fullBoard.columns.forEach((c) => {
        if (isEmpty(c.cards)) {
          c.cards = [generatePlaceholderCard(c)];
          c.cardOrderIds = [generatePlaceholderCard(c)._id];
        } else {
          c.cards = mapOrder(c.cards, c.cardOrderIds, "_id");
        }
      });
      state.currentActiveBoard = fullBoard;
    });
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
