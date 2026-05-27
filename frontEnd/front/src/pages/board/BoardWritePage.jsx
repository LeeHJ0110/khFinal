import React, { useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styled from "styled-components";
import useBoardForm from "../../features/board/hooks/useBoardForm";

const Container = styled.div`
  width: var(--layout-width);
  margin: 0 auto;
  padding: 60px var(--layout-padding-x);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
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

  // 사용자 로그인 체크 임시 비활성화 및 리마인더 alert 추가
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert(
        "로그인 기능 만들면 비로그인자는 로그인 페이지로 이동하게 코드 교체",
      );
    }
  }, []);

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
          </CustomSelect>

          {boardCategory === "FREE" && (
            <CustomSelect
              value={boardSubCategory}
              onChange={handleSubCategoryChange}
            >
              <option value="TALK">TALK</option>
              <option value="INFORMATION">INFORMATION</option>
              <option value="JOKE">JOKE</option>
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
    </Container>
  );
}
