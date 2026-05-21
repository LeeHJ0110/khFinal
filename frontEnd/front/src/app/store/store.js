import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    book: bookReducer, //TODO reducer 적용하기
  },
});

export default store;
