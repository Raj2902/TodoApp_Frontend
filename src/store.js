import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./redux/reducers/todoSlice";
import userReducer from "./redux/reducers/userSlice";

const store = configureStore({
  reducer: {
    todo: todoReducer,
    user: userReducer,
  },
});

export default store;
