import { configureStore } from "@reduxjs/toolkit";
import { activeBoardReducer } from "./activeBoard/activeBoardSlice";
import { userReducer } from "./user/userSlice";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { activeCardReducer } from "./activeCard/activeCardSlice";
import { notificationsReducer } from "./notifications/notificationsSlice";
// cấu hình persist
const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // định nghĩa các slide được phép duy trì qua mỗi lần f5
  // blacklist: ["user"], // định nghĩa các slide không được phép duy trì qua mỗi lần f5
};
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer,
  user: userReducer,
});

// thực hiện persist reducers
const persistedReducer = persistReducer(rootPersistConfig, reducers);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
