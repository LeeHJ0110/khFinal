import { configureStore } from "@reduxjs/toolkit";
import memberReducer from "../../features/member/store/memberSlice";
import boardReducer from "../../features/board/store/boardSlice";

const store = configureStore({
  reducer: {
    member: memberReducer,
    board: boardReducer,
  },
});

export default store;
