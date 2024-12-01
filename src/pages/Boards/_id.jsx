// detail đi sâu vào 1 board cụ thể chứa các colun việc
import Container from "@mui/material/Container";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { useEffect } from "react";
import {
  fetchBoardDetailsAPI,
  selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
import ActiveCard from "~/components/Modal/ActiveCard/ActiveCard";

const Board = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);

  useEffect(() => {
    // 6595599e85e8209d74e7319c
    dispatch(fetchBoardDetailsAPI(boardId));
  }, [boardId, dispatch]);

  if (!board) {
    return <PageLoadingSpinner caption="Loading..." />;
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <ActiveCard />
      <AppBar />
      <BoardBar board={board} />
      <BoardContent />
    </Container>
  );
};

export default Board;
