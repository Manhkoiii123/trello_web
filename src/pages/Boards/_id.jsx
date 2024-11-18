// detail đi sâu vào 1 board cụ thể chứa các colun việc
import Container from "@mui/material/Container";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { useEffect, useState } from "react";
import {
  createNewCardAPI,
  createNewColumnAPI,
  deleteColumnAPI,
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
} from "~/apis";
import { generatePlaceholderCard } from "~/utils/formaters";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep } from "lodash";

const Board = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);

  useEffect(() => {
    const boardId = "6595599e85e8209d74e7319c";
    dispatch(fetchBoardDetailsAPI(boardId));
  }, [dispatch]);

  const createNewColumn = async (newColumnData) => {
    const res = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });
    res.cards = [generatePlaceholderCard(res)];
    res.cardOrderIds = [generatePlaceholderCard(res)._id];
    //c1
    // const newBoard = cloneDeep(board);
    //c2
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.concat([res]);
    newBoard.columnOrderIds = newBoard.columnOrderIds.concat([res._id]);

    // newBoard.columns.push(res);
    // newBoard.columnOrderIds.push(res._id);
    dispatch(updateCurrentActiveBoard(newBoard));
  };
  const createNewCard = async (newCardData) => {
    const res = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });
    const newBoard = cloneDeep(board);
    //tim column chứa cái card vừa tạo ra
    const columnToUpdate = newBoard.columns.find((c) => c._id === res.columnId);
    if (columnToUpdate) {
      if (columnToUpdate.cards.some((card) => card.FE_placholderCard)) {
        //rông
        columnToUpdate.cards = [res];
        columnToUpdate.cardOrderIds = [res._id];
      } else {
        //có đât thì push vào
        columnToUpdate.cards.push(res);
        columnToUpdate.cardOrderIds.push(res._id);
      }
    }
    dispatch(updateCurrentActiveBoard(newBoard));
  };

  const moveColumn = (dndOrderedColumn) => {
    const dndOrderedColumnIds = dndOrderedColumn.map((c) => c._id);
    const newBoard = cloneDeep(board);
    // cái này nó ko push biếc gì => có thể shallow copy = spead operator được
    // 2 dòng dưới này tương tự concat => vẫn ok
    newBoard.columns = dndOrderedColumn;
    newBoard.columnOrderIds = dndOrderedColumnIds;
    dispatch(updateCurrentActiveBoard(newBoard));
    updateBoardDetailsAPI(board._id, {
      columnOrderIds: newBoard.columnOrderIds,
    });
  };

  const moveCardInSameColumn = (
    dndOrderedCard,
    dndOrderedCardIds,
    columnId
  ) => {
    //update cho board
    const newBoard = cloneDeep(board);
    const columnToUpdate = newBoard.columns.find((c) => c._id === columnId);
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCard;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }
    dispatch(updateCurrentActiveBoard(newBoard));
    //gọi api
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardIds,
    });
  };
  const moveCardDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumn
  ) => {
    const dndOrderedColumnIds = dndOrderedColumn.map((c) => c._id);
    const newBoard = cloneDeep(board);
    newBoard.columns = dndOrderedColumn;
    newBoard.columnOrderIds = dndOrderedColumnIds;
    dispatch(updateCurrentActiveBoard(newBoard));
    //fix bug 73
    let prevCardOrderIds = dndOrderedColumn.find(
      (c) => c._id === prevColumnId
    )?.cardOrderIds;
    if (prevCardOrderIds[0].includes("placeholder-card")) {
      prevCardOrderIds = [];
    }
    //gọi api
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumn.find((c) => c._id === nextColumnId)
        ?.cardOrderIds,
    });
  };
  const deleteColumn = (columnId) => {
    const newBoard = cloneDeep(board);
    newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId);
    newBoard.columnOrderIds = newBoard.columns.map((c) => c._id);
    dispatch(updateCurrentActiveBoard(newBoard));
    deleteColumnAPI(columnId).then((res) => {
      toast.success(res?.deleteResult);
    });
  };
  if (!board) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        deleteColumn={deleteColumn}
        moveColumn={moveColumn}
        moveCardDifferentColumn={moveCardDifferentColumn}
        moveCardInSameColumn={moveCardInSameColumn}
        createNewCard={createNewCard}
        createNewColumn={createNewColumn}
        board={board}
      />
    </Container>
  );
};

export default Board;
