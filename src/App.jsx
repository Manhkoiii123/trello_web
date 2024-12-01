import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Board from "~/pages/Boards/_id";
import NotFound from "./pages/404/NotFound";
import Auth from "./pages/Auth/Auth";
import AccountVerification from "./pages/Auth/AccountVerification";
import { selectCurrentUser } from "~/redux/user/userSlice";
import { useSelector } from "react-redux";
import Settings from "./pages/Settings/Settings";
import Boards from "./pages/Boards";

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace={true} />;
  } else {
    return <Outlet />;
  }
};
function App() {
  const currentUser = useSelector(selectCurrentUser);
  return (
    <Routes>
      <Route
        path="/"
        // replace để ko lưu history (khi vào / => đá sang cái kia luôn => cái / ko lưu vào history)
        // đang ở /abc => / => /boards... nếu replace = true => sẽ ko lưu cái / nữa => từ cái /board => sang abc
        element={<Navigate to="/boards" replace />}
      />
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="/boards/:boardId" element={<Board />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/settings/account" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
      </Route>

      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
