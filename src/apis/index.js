import axios from "axios";
import { API_ROOT } from "~/utils/constant";

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = axios.get(`${API_ROOT}/v1/boards/${boardId}`);
  //axios luôn trả về cái kết quả trong 1 cái data
  return response.data;
};
