import axios from "axios";
import { API_ROOT } from "~/utils/constant";

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
  return response.data;
};
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  );
  return response.data;
};
export const createNewColumnAPI = async (newcolumnData) => {
  const res = await axios.post(`${API_ROOT}/v1/columns`, newcolumnData);
  return res.data;
};
export const createNewCardAPI = async (newCardData) => {
  const res = await axios.post(`${API_ROOT}/v1/cards`, newCardData);
  return res.data;
};
