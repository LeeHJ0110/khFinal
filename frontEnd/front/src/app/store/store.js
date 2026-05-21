import { configureStore } from "@reduxjs/toolkit";
import memberReducer from "../../features/member/store/memberSlice";

const store = configureStore({
  reducer: {
    // book: bookReducer, //TODO reducer 적용하기
    member: memberReducer,
  },
});

export default store;
