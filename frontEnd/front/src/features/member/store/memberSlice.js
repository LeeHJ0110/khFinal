import { createSlice } from "@reduxjs/toolkit";

function parseToken(token) {
  if (!token) return { username: null, nickname: null };
  const payload = JSON.parse(atob(token.split(".")[1]));
  return { username: payload.username, nickname: payload.nickname };
}

const token = localStorage.getItem("accessToken");
const { username, nickname } = parseToken(token);

const initialState = {
  accessToken: token,
  username,
  nickname,
};

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    login(state, action) {
      const { username, nickname } = parseToken(action.payload);
      state.accessToken = action.payload;
      state.username = username;
      state.nickname = nickname;
      localStorage.setItem("accessToken", action.payload);
    },
    logout(state) {
      state.accessToken = null;
      state.username = null;
      state.nickname = null;
      localStorage.removeItem("accessToken");
    },
  },
});

export const { login, logout } = memberSlice.actions;
export default memberSlice.reducer;
