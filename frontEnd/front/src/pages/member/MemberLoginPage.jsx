import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import useFormData from "../../shared/hooks/useFormData";
import useMemberLogin from "../../features/member/hooks/useMemberLogin";

import "./LoginPage.css";
import bg from "../../assets/images/로그인용.mp4";
import logo from "../../assets/images/login_logo1.png";
import logo2 from "../../assets/images/login_logo2.png";

export default function MemberLoginPage() {
  const initState = {
    username: "",
    password: "",
  };

  const token = useSelector((state) => state.member.token);
  const navigate = useNavigate();

  const { formData, handleChange } = useFormData(initState);
  const { handleLogin, error } = useMemberLogin();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (token) {
    return null;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    const isSuccess = await handleLogin(formData);

    if (isSuccess) {
      navigate("/");
    }
  }

  function handleKakaoLogin() {
    const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}`;

    window.location.href = kakaoAuthUrl;
  }

  return (
    <main className="login-page">
      <video className="login-bg-video" autoPlay muted loop playsInline>
        <source src={bg} type="video/mp4" />
      </video>

      <div className="login-overlay" />

      <section className="login-hero">
        <img src={logo} alt="PET&I FOR" className="main-logo" />

        <h2>반려동물과 함께하는</h2>
        <h1>건강한 하루의 시작</h1>

        <p>
          소중한 반려동물의 건강을 위해,
          <br />
          체계적인 건강 기록과 맞춤케어,
          <br />
          전문가 상담을 한 곳에서 만나보세요.
        </p>
      </section>

      <section className="login-card">
        <img src={logo2} alt="PET&I FOR" className="card-logo" />

        <h2>로그인</h2>
        <p className="welcome">PET&I FOR에 오신 것을 환영합니다</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="아이디를 입력해주세요"
            name="username"
            onChange={handleChange}
            value={formData.username}
          />

          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            name="password"
            onChange={handleChange}
            value={formData.password}
          />

          <div className="login-options">
            <label>
              <input type="checkbox" />
              자동 로그인
            </label>
            <span>아이디/비밀번호 찾기</span>
          </div>

          <button type="submit" className="login-btn">
            로그인
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}

        <div className="divider" />

        <button type="button" className="kakao-btn" onClick={handleKakaoLogin}>
          카카오 간편 로그인
        </button>

        <button
          type="button"
          className="join-btn"
          onClick={() => navigate("/member/join")}
        >
          회원가입
        </button>
      </section>
    </main>
  );
}
