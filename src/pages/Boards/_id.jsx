// detail đi sâu vào 1 board cụ thể chứa các colun việc
import Container from "@mui/material/Container";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { useEffect, useState } from "react";
import {
  createNewCardAPI,
  createNewColumnAPI,
  fetchBoardDetailsAPI,
} from "~/apis";
import { isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utils/formaters";

const Board = () => {
  const [board, setBoard] = useState(null);
  useEffect(() => {
    // const boardId = reactrouterdom lấy ra => tuy nhiên chỉ làm 1 borad ở khóa này thôi
    const boardId = "6595599e85e8209d74e7319c";
    //res là cái kết quả trả về của fetchBoardDetailsAPI
    fetchBoardDetailsAPI(boardId).then((res) => {
      res.columns.forEach((c) => {
        if (isEmpty(c.cards)) {
          c.cards = [generatePlaceholderCard(c)];
          c.cardOrderIds = [generatePlaceholderCard(c)._id];
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
      columnToUpdate.cards.push(res);
      columnToUpdate.cardOrderIds.push(res._id);
    }
    setBoard(newBoard);
  };
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        createNewCard={createNewCard}
        createNewColumn={createNewColumn}
        board={board}
      />
    </Container>
  );
};

export default Board;
