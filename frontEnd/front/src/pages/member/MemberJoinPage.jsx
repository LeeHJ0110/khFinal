import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useMemberJoinForm from "../../features/member/hooks/useMemberJoinForm";

import "./MemberJoinPage.css";
import logo from "../../assets/images/login_logo2.png";

export default function MemberJoinPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const marketingAgreeYn = location.state?.marketingAgreeYn || "N";

  const {
    formData,
    handleChange,
    handleSubmit,
    handleCheckUsername,
    handleCheckNickname,
    usernameMessage,
    nicknameMessage,
    passwordMessage,
    isSuccess,
  } = useMemberJoinForm(marketingAgreeYn);

  useEffect(() => {
    if (isSuccess) {
      navigate("/member/join/complete");
    }
  }, [isSuccess, navigate]);

  return (
    <main className="join-page">
      <section className="join-card info">
        <img src={logo} alt="logo" className="join-logo" />

        <h1 className="join-title">회원가입</h1>

        <p className="join-subtitle">
          반려동물의 건강을 기록하고 더 행복한 일상을 만들어보세요.
        </p>

        <div className="join-step">
          <span className="done">01 약관동의 ✓</span>
          <span className="active">02 정보입력</span>
          <span>03 가입완료</span>
        </div>

        <form className="join-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>아이디 *</label>

            <div className="with-btn">
              <input
                type="text"
                placeholder="아이디"
                name="username"
                onChange={handleChange}
                value={formData.username}
              />

              <button type="button" onClick={handleCheckUsername}>
                중복확인
              </button>
            </div>

            <p className="form-message">{usernameMessage}</p>
          </div>

          <div className="form-field">
            <label>닉네임 *</label>

            <div className="with-btn">
              <input
                type="text"
                placeholder="닉네임"
                name="nickname"
                onChange={handleChange}
                value={formData.nickname}
              />

              <button type="button" onClick={handleCheckNickname}>
                중복확인
              </button>
            </div>

            <p className="form-message">{nicknameMessage}</p>
          </div>

          <div className="form-field">
            <label>비밀번호 *</label>

            <input
              type="password"
              placeholder="비밀번호"
              name="password"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          <div className="form-field">
            <label>비밀번호 확인 *</label>

            <input
              type="password"
              placeholder="비밀번호 확인"
              name="passwordCheck"
              onChange={handleChange}
              value={formData.passwordCheck}
            />

            <p className="form-message">{passwordMessage}</p>
          </div>

          <div className="form-field">
            <label>전화번호 *</label>

            <div className="with-btn">
              <input
                type="text"
                placeholder="전화번호"
                name="phone"
                onChange={handleChange}
                value={formData.phone}
              />

              <button type="button">인증</button>
            </div>
          </div>

          <div className="form-field">
            <label>이메일</label>

            <input
              type="text"
              placeholder="이메일"
              name="email"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className="form-field full">
            <label>주소 *</label>

            <div className="with-btn address">
              <input
                type="text"
                placeholder="주소"
                name="address"
                onChange={handleChange}
                value={formData.address}
              />

              <button type="button">주소 검색</button>
            </div>
          </div>

          <div className="form-field full">
            <label>상세주소</label>

            <input
              type="text"
              placeholder="상세주소"
              name="addressDetail"
              onChange={handleChange}
              value={formData.addressDetail}
            />
          </div>

          <button type="submit" className="join-main-btn">
            회원가입
          </button>
        </form>
      </section>
    </main>
  );
}
