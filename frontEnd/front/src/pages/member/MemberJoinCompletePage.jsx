import { useNavigate, useSearchParams } from "react-router-dom";

import "./MemberJoinPage.css";
import logo from "../../assets/images/login_logo2.png";

export default function MemberJoinCompletePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectParam = searchParams.get("redirect");

  return (
    <main className="join-page">
      <section className="join-card">
        <img src={logo} alt="logo" className="join-logo" />

        <h1 className="join-title">회원가입</h1>

        <div className="join-step">
          <span className="done">01 약관동의 ✓</span>
          <span className="done">02 정보입력 ✓</span>
          <span className="active">03 가입완료</span>
        </div>

        <div className="complete-box">
          <div className="check-circle">✓</div>

          <h2>가입이 완료되었습니다!</h2>

          <p>이제 PET&I FOR에서 건강 관리를 시작해보세요.</p>
        </div>

        <div className="complete-buttons">
          <button onClick={() => navigate("/")}>홈으로 가기</button>

          <button
            onClick={() =>
              navigate(
                `/member/login${
                  redirectParam
                    ? `?redirect=${encodeURIComponent(redirectParam)}`
                    : ""
                }`,
              )
            }
          >
            로그인 하기
          </button>
        </div>
      </section>
    </main>
  );
}
