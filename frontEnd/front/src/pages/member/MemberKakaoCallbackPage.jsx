import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { kakaoLogin } from "../../features/member/api/memberApi";
import { login } from "../../features/member/store/memberSlice";

export default function MemberKakaoCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function processKakaoLogin() {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");

      if (!code) {
        alert("카카오 인가코드가 없습니다.");
        navigate("/member/login");
        return;
      }

      try {
        const resp = await kakaoLogin(code);
        const data = resp.data;

        if (data.result === "LOGIN") {
          dispatch(login(data.token));
          navigate("/");
          return;
        }

        if (data.result === "NEED_JOIN") {
          navigate("/member/join?type=kakao", {
            state: {
              socialId: data.socialId,
            },
          });
          return;
        }

        alert("카카오 로그인 처리 실패");
        navigate("/member/login");
      } catch (err) {
        console.error(err);
        alert("카카오 로그인 실패");
        navigate("/member/login");
      }
    }

    processKakaoLogin();
  }, [location.search, navigate, dispatch]);

  return <div>카카오 로그인 처리중...</div>;
}
