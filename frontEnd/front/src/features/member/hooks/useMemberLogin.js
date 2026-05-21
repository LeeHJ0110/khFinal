import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/memberSlice";
import { loginApi } from "../api/memberApi";

export default function useMemberLogin() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  async function handleLogin(vo) {
    try {
      const resp = await loginApi(vo);
      const token = resp.headers.authorization.replace("Bearer ", "");
      dispatch(login(token));
      return true;
    } catch (err) {
      console.log("err : ", err);
      setError(err.response?.data?.msg || "로그인 실패 ...");
      return false;
    }
  }

  return { handleLogin, error };
}
