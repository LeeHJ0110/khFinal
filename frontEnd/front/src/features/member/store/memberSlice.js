import { createSlice } from "@reduxjs/toolkit";

function parseToken(token) {
  if (!token) return { username: null, nickname: null };
  try {
    const payload = token.split(".")[1];
    if (!payload) return { username: null, nickname: null };
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    const parsed = JSON.parse(decodedPayload);
    return { username: parsed.username, nickname: parsed.nickname };
  } catch (e) {
    console.error("Token decode error", e);
    return { username: null, nickname: null };
  }
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
