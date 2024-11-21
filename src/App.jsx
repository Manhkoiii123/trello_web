import { Navigate, Route, Routes } from "react-router-dom";
import Board from "~/pages/Boards/_id";
import NotFound from "./pages/404/NotFound";
import Auth from "./pages/Auth/Auth";
import AccountVerification from "./pages/Auth/AccountVerification";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        // replace để ko lưu history (khi vào / => đá sang cái kia luôn => cái / ko lưu vào history)
        // đang ở /abc => / => /boards... nếu replace = true => sẽ ko lưu cái / nữa => từ cái /board => sang abc
        element={<Navigate to="/boards/6595599e85e8209d74e7319c" replace />}
      />
      <Route path="/boards/:boardId" element={<Board />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
