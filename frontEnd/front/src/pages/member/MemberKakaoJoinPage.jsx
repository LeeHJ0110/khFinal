import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import useMemberKakaoJoinForm from "../../features/member/hooks/useMemberKakaoJoinForm";

import "./MemberJoinPage.css";

import logo from "../../assets/images/login_logo2.png";
import AddressSearchModal from "../../shared/components/AddressSearchModal";
export default function MemberKakaoJoinPage() {
  const location = useLocation();

  const socialId = location.state?.socialId;

  const marketingAgreeYn = location.state?.marketingAgreeYn || "N";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const {
    formData,
    handleChange,
    handleSubmit,
    handleCheckNickname,
    nicknameMessage,
    phoneMessage,
    isSuccess,
  } = useMemberKakaoJoinForm(socialId, marketingAgreeYn);

  useEffect(() => {
    if (isSuccess) {
      navigate(
        `/member/join/complete${
          redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""
        }`,
      );
    }
  }, [isSuccess, navigate, redirectParam]);

  return (
    <main className="join-page">
      <section className="join-card kakao">
        <img src={logo} alt="logo" className="join-logo" />

        <h1 className="join-title">회원가입</h1>

        <p className="join-subtitle">
          반려동물의 건강을 기록하고 더 행복한 일상을 만들어보세요.
        </p>

        {/* STEP */}

        <div className="join-step">
          <span className="done">01 약관동의 ✓</span>

          <span className="active">02 정보입력</span>

          <span>03 가입완료</span>
        </div>

        {/* 카카오 버튼 */}

        <button type="button" className="kakao-join-btn">
          카카오 간편 회원가입
        </button>

        {/* FORM */}

        <form className="join-form kakao-form" onSubmit={handleSubmit}>
          {/* 닉네임 */}

          <div className="form-field full">
            <label>닉네임 *</label>

            <div className="with-btn">
              <input
                type="text"
                placeholder="닉네임을 입력해주세요"
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

          {/* 전화번호 */}

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

            <p className="form-message">{phoneMessage}</p>
          </div>

          {/* 이메일 */}

          <div className="form-field">
            <label>이메일</label>

            <input
              type="text"
              placeholder="example@gmail.com"
              name="email"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          {/* 주소 */}

          <div className="form-field full">
            <label>주소 *</label>

            <div className="with-btn address">
              <input
                type="text"
                placeholder="주소를 입력해주세요"
                name="address"
                onChange={handleChange}
                value={formData.address}
                readOnly
              />

              <button type="button" onClick={() => setAddressModalOpen(true)}>
                주소검색
              </button>
            </div>
          </div>

          {/* 상세주소 */}

          <div className="form-field full">
            <label>상세주소</label>

            <input
              type="text"
              placeholder="상세주소를 입력해주세요"
              name="addressDetail"
              onChange={handleChange}
              value={formData.addressDetail}
            />
          </div>

          <p className="required-text">* 는 필수입력 항목입니다.</p>

          {/* 이전 */}

          <button
            type="button"
            className="prev-link"
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
            ← 로그인으로 돌아가기
          </button>

          {/* 가입 */}

          <button type="submit" className="join-main-btn">
            가입
          </button>
        </form>
      </section>
      {isAddressModalOpen && (
        <AddressSearchModal
          onClose={() => setAddressModalOpen(false)}
          onComplete={({ address, zipCode }) => {
            handleChange({
              target: {
                name: "address",
                value: address,
              },
            });

            handleChange({
              target: {
                name: "zipCode",
                value: zipCode,
              },
            });
          }}
        />
      )}
    </main>
  );
}
