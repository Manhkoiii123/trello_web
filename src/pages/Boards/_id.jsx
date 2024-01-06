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
  fetchBoardDetailsAPI,
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
} from "~/apis";
import { isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utils/formaters";
import { mapOrder } from "~/utils/sort";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

const Board = () => {
  const [board, setBoard] = useState(null);
  useEffect(() => {
    // const boardId = reactrouterdom lấy ra => tuy nhiên chỉ làm 1 borad ở khóa này thôi
    const boardId = "6595599e85e8209d74e7319c";
    //res là cái kết quả trả về của fetchBoardDetailsAPI
    fetchBoardDetailsAPI(boardId).then((res) => {
      //xếp thứ tự luôn #71
      res.columns = mapOrder(res.columns, res.columnOrderIds, "_id");
      res.columns.forEach((c) => {
        if (isEmpty(c.cards)) {
          c.cards = [generatePlaceholderCard(c)];
          c.cardOrderIds = [generatePlaceholderCard(c)._id];
        } else {
          //#71
          c.cards = mapOrder(c.cards, c.cardOrderIds, "_id");
        }
      });

      setBoard(res);
    });
  }, []);
  //gọi api + ref dữ liệu board
  const createNewColumn = async (newColumnData) => {
    const res = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });
    res.cards = [generatePlaceholderCard(res)];
    res.cardOrderIds = [generatePlaceholderCard(res)._id];
    const newBoard = { ...board };
    newBoard.columns.push(res);
    newBoard.columnOrderIds.push(res._id);
    setBoard(newBoard);
  };
  const createNewCard = async (newCardData) => {
    const res = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });
    const newBoard = { ...board };
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
    setBoard(newBoard);
  };

  const moveColumn = (dndOrderedColumn) => {
    const dndOrderedColumnIds = dndOrderedColumn.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumn;
    newBoard.columnOrderIds = dndOrderedColumnIds;
    setBoard(newBoard);
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
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find((c) => c._id === columnId);
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCard;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }
    setBoard(newBoard);
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
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumn;
    newBoard.columnOrderIds = dndOrderedColumnIds;
    setBoard(newBoard);
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
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId);
    newBoard.columnOrderIds = newBoard.columns.map((c) => c._id);
    setBoard(newBoard);
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
