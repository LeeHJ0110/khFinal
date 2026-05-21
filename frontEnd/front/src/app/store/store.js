import { configureStore } from "@reduxjs/toolkit";
import memberReducer from "../../features/member/store/memberSlice";

const store = configureStore({
  reducer: {
    member: memberReducer,
  },
});

export default store;
