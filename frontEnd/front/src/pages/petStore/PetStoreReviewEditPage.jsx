import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { updateReview } from "../../features/petStore/api/petStoreReviewApi";
import PetStoreNavGate from "./PetStoreNavGate";

const TITLE_MAX_LENGTH = 50;
const CONTENT_MAX_LENGTH = 500;

export default function PetStoreReviewEditPage() {
  const { reviewId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const reviewTarget = location.state ?? {};

  const parsedReviewId = useMemo(() => Number(reviewId), [reviewId]);

  const [reviewRating, setReviewRating] = useState(
    Number(reviewTarget.reviewRating ?? 0),
  );
  const [reviewTitle, setReviewTitle] = useState(
    reviewTarget.reviewTitle ?? "",
  );
  const [reviewContent, setReviewContent] = useState(
    reviewTarget.reviewContent ?? "",
  );

  const [fileList, setFileList] = useState([]);
  const [newPreviewList, setNewPreviewList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingImageUrlList = reviewTarget.reviewImageUrlList ?? [];

  const hasNewFiles = newPreviewList.length > 0;

  function handleChangeTitle(evt) {
    const value = evt.target.value;

    if (value.length > TITLE_MAX_LENGTH) {
      return;
    }

    setReviewTitle(value);
  }

  function handleChangeContent(evt) {
    const value = evt.target.value;

    if (value.length > CONTENT_MAX_LENGTH) {
      return;
    }

    setReviewContent(value);
  }

  function handleChangeFiles(evt) {
    const selectedFiles = Array.from(evt.target.files ?? []);

    if (fileList.length + selectedFiles.length > 3) {
      alert("리뷰 이미지는 최대 3장까지 첨부할 수 있습니다.");
      evt.target.value = "";
      return;
    }

    const imageOnlyFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageOnlyFiles.length !== selectedFiles.length) {
      alert("이미지 파일만 첨부할 수 있습니다.");
      evt.target.value = "";
      return;
    }

    const overSizeFile = imageOnlyFiles.find(
      (file) => file.size > 3 * 1024 * 1024,
    );

    if (overSizeFile) {
      alert("리뷰 이미지는 파일당 최대 3MB까지 첨부할 수 있습니다.");
      evt.target.value = "";
      return;
    }

    const nextFileList = [...fileList, ...imageOnlyFiles];
    const nextPreviewList = [
      ...newPreviewList,
      ...imageOnlyFiles.map((file) => ({
        fileName: file.name,
        url: URL.createObjectURL(file),
      })),
    ];

    setFileList(nextFileList);
    setNewPreviewList(nextPreviewList);

    evt.target.value = "";
  }

  function handleRemoveNewFile(index) {
    const targetPreview = newPreviewList[index];

    if (targetPreview?.url) {
      URL.revokeObjectURL(targetPreview.url);
    }

    setFileList((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
    setNewPreviewList((prev) =>
      prev.filter((_, previewIndex) => previewIndex !== index),
    );
  }

  function validateForm() {
    if (!parsedReviewId || Number.isNaN(parsedReviewId)) {
      alert("리뷰 정보가 없습니다.");
      return false;
    }

    if (!reviewRating) {
      alert("별점을 선택해주세요.");
      return false;
    }

    if (!reviewTitle.trim()) {
      alert("한줄 제목을 입력해주세요.");
      return false;
    }

    if (!reviewContent.trim()) {
      alert("상품 후기를 입력해주세요.");
      return false;
    }

    return true;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      await updateReview({
        reviewId: parsedReviewId,
        reviewTitle: reviewTitle.trim(),
        reviewContent: reviewContent.trim(),
        reviewRating,
        fileList,
      });

      alert("리뷰가 수정되었습니다.");
      navigate("/store/review/list");
    } catch (error) {
      alert(error?.response?.data?.message ?? "리뷰 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  function handleGoProductDetail() {
    if (!reviewTarget?.productId) {
      return;
    }

    navigate(`/store/product/${reviewTarget.productId}`);
  }

  if (!reviewTarget.reviewId && !reviewTarget.reviewTitle) {
    return (
      <Wrapper>
        <PetStoreNavGate />

        <Inner>
          <EmptyBox>
            <EmptyTitle>수정할 리뷰 정보가 없습니다.</EmptyTitle>
            <EmptyDesc>
              내 리뷰내역 페이지에서 수정 버튼을 눌러 다시 진입해주세요.
            </EmptyDesc>

            <BackButton
              type="button"
              onClick={() => navigate("/store/review/list")}
            >
              내 리뷰내역으로 이동
            </BackButton>
          </EmptyBox>
        </Inner>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PetStoreNavGate />

      <Inner>
        <PageHeader>
          <PageTitle>리뷰수정</PageTitle>
          <PageDesc>작성한 후기를 수정할 수 있습니다.</PageDesc>
        </PageHeader>

        <ProductCard>
          <ProductInfoGrid>
            <InfoItem $wide>
              <InfoLabel>상품명</InfoLabel>
              <InfoValue>{reviewTarget?.productName ?? "-"}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>작성일자</InfoLabel>
              <InfoValue>{reviewTarget?.createdAt ?? "-"}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>현재별점</InfoLabel>
              <InfoValue>{reviewTarget?.reviewRating ?? "-"}점</InfoValue>
            </InfoItem>
          </ProductInfoGrid>

          <DetailButton
            type="button"
            onClick={handleGoProductDetail}
            disabled={!reviewTarget?.productId}
          >
            상품 상세보기
            <span>›</span>
          </DetailButton>
        </ProductCard>

        <FormCard onSubmit={handleSubmit}>
          <FormGrid>
            <FormLabel>별점</FormLabel>

            <FieldArea>
              <StarBox>
                {[1, 2, 3, 4, 5].map((score) => (
                  <StarButton
                    key={score}
                    type="button"
                    $active={score <= reviewRating}
                    onClick={() => setReviewRating(score)}
                  >
                    ★
                  </StarButton>
                ))}
              </StarBox>

              <FieldGuide>
                {reviewRating
                  ? `${reviewRating}점을 선택했습니다.`
                  : "별점을 선택해주세요."}
              </FieldGuide>
            </FieldArea>

            <FormLabel>한줄 제목</FormLabel>

            <FieldArea>
              <InputWrap>
                <TitleInput
                  value={reviewTitle}
                  onChange={handleChangeTitle}
                  placeholder="후기의 제목을 입력해주세요."
                />

                <CountText>
                  {reviewTitle.length}/{TITLE_MAX_LENGTH}
                </CountText>
              </InputWrap>
            </FieldArea>

            <FormLabel>상품 후기</FormLabel>

            <FieldArea>
              <TextAreaWrap>
                <ReviewTextArea
                  value={reviewContent}
                  onChange={handleChangeContent}
                  placeholder="상품에 대한 후기를 자세히 작성해주세요."
                />

                <CountText>
                  {reviewContent.length}/{CONTENT_MAX_LENGTH}
                </CountText>
              </TextAreaWrap>
            </FieldArea>

            <FormLabel>사진첨부</FormLabel>

            <FieldArea>
              {!hasNewFiles && existingImageUrlList.length > 0 && (
                <>
                  <ExistingImageTitle>
                    기존 첨부 이미지
                    <span>
                      새 이미지를 선택하면 기존 이미지는 새 이미지로 교체됩니다.
                    </span>
                  </ExistingImageTitle>

                  <ImageUploadRow>
                    {existingImageUrlList.map((url, index) => (
                      <PreviewBox key={`${url}-${index}`}>
                        <PreviewImage
                          src={url}
                          alt={`기존 리뷰 이미지 ${index + 1}`}
                        />
                      </PreviewBox>
                    ))}
                  </ImageUploadRow>
                </>
              )}

              {hasNewFiles && (
                <>
                  <ExistingImageTitle>
                    새로 선택한 이미지
                    <span>저장 시 기존 이미지는 새 이미지로 교체됩니다.</span>
                  </ExistingImageTitle>

                  <ImageUploadRow>
                    {newPreviewList.map((preview, index) => (
                      <PreviewBox key={`${preview.fileName}-${index}`}>
                        <PreviewImage
                          src={preview.url}
                          alt={preview.fileName}
                        />

                        <RemoveImageButton
                          type="button"
                          onClick={() => handleRemoveNewFile(index)}
                        >
                          ×
                        </RemoveImageButton>
                      </PreviewBox>
                    ))}
                  </ImageUploadRow>
                </>
              )}

              <ImageUploadRow $marginTop>
                {newPreviewList.length < 3 && (
                  <UploadLabel>
                    <UploadInput
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleChangeFiles}
                    />

                    <PlusIcon>＋</PlusIcon>
                    <UploadText>사진 추가</UploadText>
                  </UploadLabel>
                )}
              </ImageUploadRow>

              <ImageGuide>
                JPG, PNG 파일만 가능 · 최대 3장 · 파일당 3MB
              </ImageGuide>
            </FieldArea>
          </FormGrid>
        </FormCard>

        <ButtonArea>
          <SubmitButton
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "수정 중..." : "수정완료"}
          </SubmitButton>

          <CancelButton type="button" onClick={handleCancel}>
            취소
          </CancelButton>
        </ButtonArea>
      </Inner>
    </Wrapper>
  );
}

/* ================================
   Layout
================================ */

const Wrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-white);
`;

const Inner = styled.div`
  width: 1532px;
  margin: 0 auto;
  padding: 18px 0 36px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 18px;

  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  margin: 0;

  color: var(--text-main);
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1px;
`;

const PageDesc = styled.p`
  margin: 0 0 2px;

  color: var(--text-sub);
  font-size: 14px;
  font-weight: 500;
`;

/* ================================
   Product Card
================================ */

const ProductCard = styled.section`
  min-height: 94px;
  margin-bottom: 14px;
  padding: 18px 32px;

  display: grid;
  grid-template-columns: minmax(0, 1fr) 150px;
  gap: 28px;
  align-items: center;

  border: 1px solid #cde4dc;
  border-radius: 12px;
  background:
    radial-gradient(circle at 8% 32%, rgba(0, 169, 130, 0.08), transparent 26%),
    linear-gradient(90deg, #f8fffc 0%, #ffffff 72%);
`;

const ProductInfoGrid = styled.div`
  align-self: start;

  display: grid;
  grid-template-columns: 1.7fr 1fr;
  row-gap: 13px;
  column-gap: 52px;
`;

const InfoItem = styled.div`
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  align-items: center;

  ${({ $wide }) =>
    $wide
      ? `
        grid-column: 1 / 2;
      `
      : ""}
`;

const InfoLabel = styled.div`
  color: var(--text-sub);
  font-size: 14px;
  font-weight: 600;
`;

const InfoValue = styled.div`
  min-width: 0;

  color: var(--text-main);
  font-size: 15px;
  font-weight: 500;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DetailButton = styled.button`
  justify-self: end;

  display: flex;
  align-items: center;
  gap: 8px;

  border: 0;
  background: transparent;

  color: var(--color-main);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  span {
    font-size: 24px;
    font-weight: 300;
    line-height: 1;
  }

  &:disabled {
    color: #b0b0b0;
    cursor: not-allowed;
  }
`;

/* ================================
   Form
================================ */

const FormCard = styled.form`
  border: 1px solid #d8d8d8;
  border-radius: 12px;
  background-color: var(--color-white);
  overflow: hidden;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
`;

const FormLabel = styled.div`
  padding: 26px 30px;

  border-right: 1px solid #e5e5e5;

  color: var(--text-main);
  font-size: 16px;
  font-weight: 700;
`;

const FieldArea = styled.div`
  padding: 20px 26px;
`;

const StarBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StarButton = styled.button`
  padding: 0;

  border: 0;
  background: transparent;

  color: ${({ $active }) => ($active ? "#00a982" : "#d8d8d8")};
  font-size: 32px;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;

  transition:
    color 0.16s ease,
    transform 0.16s ease;

  &:hover {
    color: var(--color-main);
    transform: translateY(-2px);
  }
`;

const FieldGuide = styled.span`
  display: inline-block;
  margin-top: 8px;

  color: var(--text-desc);
  font-size: 13px;
  font-weight: 500;
`;

const InputWrap = styled.div`
  width: 860px;
  position: relative;
`;

const TitleInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 42px;

  border: 1px solid #d8d8d8;
  border-radius: 8px;
  padding: 0 70px 0 16px;

  color: var(--text-main);
  font-size: 14px;
  font-weight: 500;

  &::placeholder {
    color: #b7b7b7;
  }

  &:focus {
    outline: none;
    border-color: var(--color-main);
  }
`;

const TextAreaWrap = styled.div`
  width: 860px;
  position: relative;
`;

const ReviewTextArea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  height: 104px;

  resize: none;

  border: 1px solid #d8d8d8;
  border-radius: 8px;
  padding: 15px 16px 28px;

  color: var(--text-main);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;

  &::placeholder {
    color: #b7b7b7;
  }

  &:focus {
    outline: none;
    border-color: var(--color-main);
  }
`;

const CountText = styled.span`
  position: absolute;
  right: 12px;
  bottom: 9px;

  color: var(--text-desc);
  font-size: 12px;
  font-weight: 600;
`;

const ExistingImageTitle = styled.div`
  margin-bottom: 10px;

  color: var(--text-main);
  font-size: 13px;
  font-weight: 600;

  span {
    margin-left: 10px;

    color: var(--text-desc);
    font-size: 12px;
    font-weight: 500;
  }
`;

const ImageUploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  margin-top: ${({ $marginTop }) => ($marginTop ? "12px" : "0")};
`;

const PreviewBox = styled.div`
  position: relative;

  width: 90px;
  height: 82px;

  border: 1px solid #dddddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8f8f8;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;

  width: 22px;
  height: 22px;

  border: 0;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.95);

  color: #444;
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
`;

const UploadLabel = styled.label`
  width: 90px;
  height: 82px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border: 1px dashed #cfcfcf;
  border-radius: 8px;
  background-color: #fbfbfb;

  cursor: pointer;

  &:hover {
    border-color: var(--color-main);
    background-color: #f3fffb;
  }
`;

const UploadInput = styled.input`
  display: none;
`;

const PlusIcon = styled.div`
  margin-bottom: 5px;

  color: var(--text-main);
  font-size: 28px;
  font-weight: 300;
  line-height: 1;
`;

const UploadText = styled.div`
  color: var(--text-sub);
  font-size: 12px;
  font-weight: 600;
`;

const ImageGuide = styled.p`
  margin: 8px 0 0;

  color: var(--text-desc);
  font-size: 12px;
  font-weight: 500;
`;

/* ================================
   Buttons
================================ */

const ButtonArea = styled.div`
  margin-top: 22px;

  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const SubmitButton = styled.button`
  width: 132px;
  height: 44px;

  border: 0;
  border-radius: 8px;
  background-color: var(--color-main);

  color: var(--color-white);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: var(--color-main-dark);
  }

  &:disabled {
    background-color: #b6b6b6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  width: 108px;
  height: 44px;

  border: 1px solid #d8d8d8;
  border-radius: 8px;
  background-color: var(--color-white);

  color: var(--text-main);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: var(--color-main);
    color: var(--color-main);
  }
`;

/* ================================
   Empty
================================ */

const EmptyBox = styled.div`
  height: 360px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border: 1px solid #d8d8d8;
  border-radius: 12px;
`;

const EmptyTitle = styled.div`
  margin-bottom: 8px;

  color: var(--text-main);
  font-size: 24px;
  font-weight: 800;
`;

const EmptyDesc = styled.div`
  margin-bottom: 24px;

  color: var(--text-sub);
  font-size: 15px;
  font-weight: 500;
`;

const BackButton = styled.button`
  width: 180px;
  height: 42px;

  border: 0;
  border-radius: 8px;
  background-color: var(--color-main);

  color: var(--color-white);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: var(--color-main-dark);
  }
`;
