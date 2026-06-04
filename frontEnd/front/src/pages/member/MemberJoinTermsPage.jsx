import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import "./MemberJoinPage.css";

import logo from "../../assets/images/login_logo2.png";

import checkEmpty from "../../assets/images/check-empty.png";
import checkFill from "../../assets/images/check-fill.png";

export default function MemberJoinTermsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const joinType = params.get("type"); // kakao or null
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [agreements, setAgreements] = useState({
    service: false,
    kakao: false,
    privacy: false,
    marketing: false,
  });

  const [modal, setModal] = useState(null);

  const terms = {
    service: {
      title: "[필수] PET&I FOR 서비스 약관",
      content:
        "PET&I FOR 서비스 이용약관입니다.\n\n회원은 반려동물 건강관리 서비스를 이용할 수 있으며 허위 정보 입력 시 제한될 수 있습니다.",
    },

    kakao: {
      title: "[필수] 카카오 통합서비스 약관",
      content:
        "카카오 로그인 연동 서비스 약관입니다.\n\n카카오 계정을 통해 간편 로그인 서비스를 제공합니다.",
    },

    privacy: {
      title: "[필수] 개인정보 수집 및 이용 동의",
      content:
        "회원가입을 위해 아이디, 닉네임, 전화번호 등의 정보를 수집합니다.",
    },

    marketing: {
      title: "[선택] 광고메시지 수신 동의",
      content: "이벤트 및 혜택 안내를 위한 광고 메시지 수신 동의입니다.",
    },
  };

  const requiredChecked =
    agreements.service && agreements.kakao && agreements.privacy;

  const allChecked =
    agreements.service &&
    agreements.kakao &&
    agreements.privacy &&
    agreements.marketing;

  function handleCheck(key) {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function handleAllCheck() {
    const nextValue = !allChecked;

    setAgreements({
      service: nextValue,
      kakao: nextValue,
      privacy: nextValue,
      marketing: nextValue,
    });
  }

  function handleNext() {
    if (!requiredChecked) {
      alert("필수 약관에 모두 동의해주세요.");
      return;
    }

    const redirectParam = searchParams.get("redirect");

    const nextPath =
      joinType === "kakao" ? "/member/kakao/join" : "/member/join/info";

    const nextUrl = `${nextPath}${
      redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""
    }`;

    navigate(nextUrl, {
      state: {
        ...location.state,
        marketingAgreeYn: agreements.marketing ? "Y" : "N",
      },
    });
  }

  return (
    <main className="join-page">
      <section className="join-card">
        <img src={logo} alt="logo" className="join-logo" />

        <h1 className="join-title">회원가입</h1>

        <p className="join-subtitle">
          반려동물의 건강을 기록하고 더 행복한 일상을 만들어보세요.
        </p>

        {/* STEP */}

        <div className="join-step">
          <span className="active">01 약관동의</span>
          <span>02 정보입력</span>
          <span>03 가입완료</span>
        </div>

        {/* 전체동의 */}

        <div className="terms-all">
          <img
            src={allChecked ? checkFill : checkEmpty}
            alt="check"
            className="check-icon big"
            onClick={handleAllCheck}
          />

          <div>
            <strong>약관 전체동의</strong>

            <p>
              전체 동의는 필수 및 선택 항목에 대한 동의를 포함하며, 선택항목에
              대한 동의를 거부하셔도 서비스 이용이 가능합니다.
            </p>
          </div>
        </div>

        {/* 약관목록 */}

        <div className="terms-list">
          {Object.entries(terms).map(([key, term]) => (
            <div className="term-row" key={key}>
              <img
                src={agreements[key] ? checkFill : checkEmpty}
                alt="check"
                className="check-icon"
                onClick={() => handleCheck(key)}
              />

              <button
                type="button"
                className="term-title"
                onClick={() => setModal(term)}
              >
                {term.title}
              </button>

              <button
                type="button"
                className="term-arrow"
                onClick={() => setModal(term)}
              >
                ›
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className={
            requiredChecked ? "join-main-btn" : "join-main-btn disabled"
          }
          onClick={handleNext}
        >
          동의
        </button>
      </section>

      {/* 모달 */}

      {modal && (
        <div className="terms-modal-backdrop" onClick={() => setModal(null)}>
          <div className="terms-modal" onClick={(evt) => evt.stopPropagation()}>
            <h2>{modal.title}</h2>

            <pre>{modal.content}</pre>

            <button onClick={() => setModal(null)}>확인</button>
          </div>
        </div>
      )}
    </main>
  );
}
