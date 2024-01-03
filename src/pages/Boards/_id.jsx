// detail đi sâu vào 1 board cụ thể chứa các colun việc
import Container from "@mui/material/Container";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { useEffect, useState } from "react";
import { fetchBoardDetailsAPI } from "~/apis";
import { mockData } from "~/apis/mock-data";

const Board = () => {
  const [board, setBoard] = useState(null);
  useEffect(() => {
    // const boardId = reactrouterdom lấy ra => tuy nhiên chỉ làm 1 borad ở khóa này thôi
    const boardId = "6595599e85e8209d74e7319c";
    //res là cái kết quả trả về của fetchBoardDetailsAPI
    fetchBoardDetailsAPI(boardId).then((res) => {
      setBoard(res);
    });
  }, []);
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={mockData.board} />
      <BoardContent board={mockData.board} />
    </Container>
  );
};

export default Board;
