import { createSlice } from "@reduxjs/toolkit";

const initaialState = {
  loading: false,
  error: null,
  success: false,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    },

    setSuccess(state, action) {
      state.success = action.payload;
    },

    resetStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const { setLoading, setError, setSuccess, resetStatus } =
  boardSlice.actions;

export default boardSlice.reducer;
