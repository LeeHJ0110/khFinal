import React, { useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import useBoardForm from "../../features/board/hooks/useBoardForm";
import BoardSubNavbar from "./components/BoardSubNavbar";

const getLoginMember = () => {
  const saved = localStorage.getItem("loginMember");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("loginMember parse error", e);
    }
  }
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const payloadPart = token.split(".")[1];
      if (payloadPart) {
        const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(
              (char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`,
            )
            .join(""),
        );
        const payload = JSON.parse(decodedPayload);
        return {
          username: payload.username || payload.sub,
          nickname: payload.nickname || payload.username || payload.sub,
          role: payload.role || "USER",
        };
      }
    } catch (e) {
      console.error("Token decode error", e);
    }
  }
  return null;
};

export default function BoardWritePage() {
  const {
    navigate,
    isEdit,
    boardCategory,
    boardSubCategory,
    title,
    setTitle,
    content,
    boardStars,
    handleCategoryChange,
    handleSubCategoryChange,
    handleStarClick,
    handleEditorChange,
    handleSubmit,
  } = useBoardForm();

  const location = useLocation();
  const loginMember = getLoginMember();
  const isAdmin =
    loginMember?.role === "ADMIN" ||
    loginMember?.role === "A" ||
    loginMember?.role === "BOARD" ||
    loginMember?.role === "B";

  // 사용자 로그인 권한 체크 및 리다이렉트
  useEffect(() => {
    const loginMemberObj = getLoginMember();
    if (!loginMemberObj) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.");
      navigate("/member/login");
      return;
    }

    const currentIsAdmin =
      loginMemberObj.role === "ADMIN" ||
      loginMemberObj.role === "A" ||
      loginMemberObj.role === "BOARD" ||
      loginMemberObj.role === "B";

    // 비관리자가 FAQ나 NEWS 글쓰기/수정 진입 시도 시 차단
    const targetCategory =
      location.state?.defaultCategory ||
      location.state?.board?.category ||
      boardCategory;
    if (
      !currentIsAdmin &&
      (targetCategory === "FAQ" || targetCategory === "NEWS")
    ) {
      alert("관리자만 이용할 수 있는 기능입니다.");
      navigate(-1);
    }
  }, [navigate, boardCategory, location.state]);

  // React Quill 툴바 및 모듈 구성 (시안 디자인에 맞게 최적화)
  const modules = {
    toolbar: {
      container: [
        [{ size: ["small", false, "large", "huge"] }], // 글씨 크기
        [{ font: [] }], // 기본 글꼴
        ["bold", "italic", "underline"], // B / I / U
        ["image"], // 이미지 아이콘
        [{ align: [] }], // 정렬 아이콘
      ],
    },
  };

  const formats = [
    "size",
    "font",
    "bold",
    "italic",
    "underline",
    "image",
    "align",
  ];

  return (
    <Container>
      <BoardSubNavbar
        activeTab={boardCategory}
        bypassPortal={true}
        onTabChange={(tab) => {
          if (
            window.confirm(
              "작성 중인 내용이 저장되지 않을 수 있습니다. 이동하시겠습니까?"
            )
          ) {
            if (tab === "HOME") {
              navigate("/community");
            } else {
              navigate(`/community/list?category=${tab}`);
            }
          }
        }}
      />

      <ContentWrapper>
        {/* 타이틀 영역 (수정 모드 분기) */}
        <TitleSection>
          <MainTitle>{isEdit ? "게시글수정" : "게시글작성"}</MainTitle>
          <SubTitle>반려동물과의 소중한 추억을 기록하세요!</SubTitle>
        </TitleSection>

        {/* 입력 폼 */}
        <FormWrapper onSubmit={handleSubmit}>
          {/* 게시판 & 말머리 셀렉터 (작성 가능한 게시판만 옵션 제공) */}
          <SelectorWrapper>
            <CustomSelect value={boardCategory} onChange={handleCategoryChange}>
              <option value="FREE">자유게시판</option>
              <option value="PRODUCT_REVIEW">상품후기게시판</option>
              <option value="FAC_REVIEW">시설후기게시판</option>
              {isAdmin && (
                <>
                  <option value="FAQ">FAQ게시판</option>
                  <option value="NEWS">뉴스게시판</option>
                </>
              )}
            </CustomSelect>

            {boardCategory === "FREE" && (
              <CustomSelect
                value={boardSubCategory}
                onChange={handleSubCategoryChange}
              >
                <option value="잡담">잡담</option>
                <option value="정보">정보</option>
                <option value="유머">유머</option>
              </CustomSelect>
            )}
          </SelectorWrapper>

          {/* 별점 선택기 (상품후기, 시설후기일 때만 동적으로 활성화되는 프리미엄 기능) */}
          {(boardCategory === "PRODUCT_REVIEW" ||
            boardCategory === "FAC_REVIEW") && (
            <StarsRatingContainer>
              <StarsLabel>리뷰 평점</StarsLabel>
              <StarsList>
                {[1, 2, 3, 4, 5].map((score) => (
                  <StarIcon
                    key={score}
                    filled={boardStars >= score}
                    onClick={() => handleStarClick(score)}
                  >
                    ★
                  </StarIcon>
                ))}
              </StarsList>
            </StarsRatingContainer>
          )}

          {/* 제목 입력 */}
          <TitleInputGroup>
            <TitleLabel>제목</TitleLabel>
            <TitleField
              type="text"
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </TitleInputGroup>

          {/* 에디터 (React Quill) */}
          <EditorContainer>
            <ReactQuill
              value={content}
              onChange={handleEditorChange}
              modules={modules}
              formats={formats}
              placeholder="내용을 작성해주세요. 타인을 비방하거나 불쾌감을 주는 게시글은 무통보 삭제될 수 있습니다. 가장 첫 번째 사진이 썸네일로 지정됩니다."
            />
          </EditorContainer>

          {/* 액션 버튼 */}
          <ActionsWrapper>
            <CancelButton type="button" onClick={() => navigate(-1)}>
              취소
            </CancelButton>
            <SubmitButton type="submit">
              {isEdit ? "수정하기" : "등록하기"}
            </SubmitButton>
          </ActionsWrapper>
        </FormWrapper>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  background-color: #fafbfc;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Paperozi", "Noto Sans KR", sans-serif;
  padding-bottom: 80px;
`;

const ContentWrapper = styled.div`
  width: 1000px;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`;
//test

const TitleSection = styled.div`
  width: 1000px;
  text-align: left;
  margin-bottom: 35px;
`;

const MainTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #111111;
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
`;

const SubTitle = styled.p`
  font-size: 16px;
  color: var(--text-sub);
  margin: 0;
  font-weight: 400;
`;

const FormWrapper = styled.form`
  width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SelectorWrapper = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
`;

const CustomSelect = styled.select`
  flex: 1;
  height: 48px;
  padding: 0 18px;
  font-size: 15px;
  color: var(--text-main);
  border: 1px solid #ced4da;
  border-radius: 6px;
  background-color: #ffffff;
  outline: none;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 18px center;
  background-size: 16px;

  &:focus {
    border-color: var(--color-main);
    box-shadow: 0 0 0 3px rgba(0, 169, 123, 0.1);
  }
`;

const StarsRatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background-color: var(--color-bg-light);
  border: 1px solid rgba(0, 169, 123, 0.2);
  border-radius: 8px;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StarsLabel = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: var(--color-dark);
`;

const StarsList = styled.div`
  display: flex;
  gap: 6px;
`;

const StarIcon = styled.span`
  font-size: 26px;
  color: ${(props) => (props.filled ? "#ffbc00" : "#dee2e6")};
  cursor: pointer;
  transition:
    transform 0.1s ease,
    color 0.15s ease;
  filter: ${(props) =>
    props.filled ? "drop-shadow(0 0 2px rgba(255, 188, 0, 0.4))" : "none"};

  &:hover {
    transform: scale(1.2);
  }
`;

const TitleInputGroup = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
`;

const TitleLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 100%;
  background-color: #e9ecef;
  color: var(--text-main);
  font-weight: 600;
  font-size: 15px;
  border: 1px solid #ced4da;
  border-right: none;
  border-radius: 6px 0 0 6px;
`;

const TitleField = styled.input`
  flex: 1;
  height: 100%;
  padding: 0 18px;
  font-size: 15px;
  border: 1px solid #ced4da;
  border-radius: 0 6px 6px 0;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    border-color: var(--color-main);
    box-shadow: 0 0 0 3px rgba(0, 169, 123, 0.1);
  }
`;

const EditorContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ced4da;
  background-color: #ffffff;

  .ql-toolbar.ql-snow {
    border: none;
    border-bottom: 1px solid #ced4da;
    background-color: #f8f9fa;
    padding: 12px 18px;
  }

  .ql-container.ql-snow {
    border: none;
    min-height: 480px;
    font-size: 16px;
  }

  .ql-editor {
    min-height: 480px;
    padding: 24px 20px;
    color: var(--text-main);
    line-height: 1.6;
  }

  .ql-editor.ql-blank::before {
    left: 20px;
    right: 20px;
    font-style: normal;
    color: var(--text-soft);
    font-size: 15px;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1000px;
  margin-top: 30px;
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 32px;
  font-size: 15px;
  font-weight: 500;
  color: #495057;
  background-color: #e9ecef;
  border: none;
  border-radius: 6px;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;

  &:hover {
    background-color: #dee2e6;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 32px;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  background-color: var(--color-main);
  border: none;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 169, 123, 0.15);
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.1s ease;

  &:hover {
    background-color: #008f68;
    box-shadow: 0 6px 12px rgba(0, 169, 123, 0.25);
  }

  &:active {
    transform: scale(0.98);
  }
`;

// 상단 서브 내비게이션 바
const SubNavbar = styled.div`
  width: 100%;
  height: 48px;
  background-color: #ffffff;
  border-bottom: 1px solid #eef1f2;
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

const SubNavInner = styled.div`
  width: 1400px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 0 20px;
`;

const SubNavItem = styled.button`
  height: 100%;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? "700" : "500")};
  color: ${(props) => (props.$active ? "var(--color-main)" : "#555555")};
  position: relative;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-main);
  }

  ${(props) =>
    props.$active &&
    `
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--color-main);
      border-radius: 3px 3px 0 0;
    }
  `}
`;
