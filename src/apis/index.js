import axios from "axios";
import { API_ROOT } from "~/utils/constant";

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
  return response.data;
};
//update board khi kéo column
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
//update column khi kéo card
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  );
  return response.data;
};
export const createNewCardAPI = async (newCardData) => {
  const res = await axios.post(`${API_ROOT}/v1/cards`, newCardData);
  return res.data;
};
export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  );
  return response.data;
};
export const deleteColumnAPI = async (id) => {
  const response = await axios.delete(`${API_ROOT}/v1/columns/${id}`);
  return response.data;
};
