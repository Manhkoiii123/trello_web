import authorizeAxios from "~/utils/authorizeAxios";

import { API_ROOT } from "~/utils/constant";

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await authorizeAxios.get(`${API_ROOT}/v1/boards/${boardId}`);
  return response.data;
};
//update board khi kéo column
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizeAxios.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  );
  return response.data;
};
export const createNewColumnAPI = async (newcolumnData) => {
  const res = await authorizeAxios.post(
    `${API_ROOT}/v1/columns`,
    newcolumnData
  );
  return res.data;
};
//update column khi kéo card
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizeAxios.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  );
  return response.data;
};
export const createNewCardAPI = async (newCardData) => {
  const res = await authorizeAxios.post(`${API_ROOT}/v1/cards`, newCardData);
  return res.data;
};
export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizeAxios.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  );
  return response.data;
};
export const deleteColumnAPI = async (id) => {
  const response = await authorizeAxios.delete(`${API_ROOT}/v1/columns/${id}`);
  return response.data;
};
