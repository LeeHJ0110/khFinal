import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import usePetCareDetail from "../../features/petcare/hooks/usePetCareDetail";

function DiagnosisDetailPage() {
  const { id } = useParams();

  const { petCareVo, asyncFetchPetCareDetail, isLoading } = usePetCareDetail();

  useEffect(() => {
    if (id) {
      asyncFetchPetCareDetail(id);
    }
  }, [id]);

  function formatDate(dateStr) {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  if (isLoading) {
    return <Wrapper>불러오는 중...</Wrapper>;
  }

  return (
    <Wrapper>
      <h1>건강진단 상세보기</h1>

      <InfoBox>
        <p>
          <strong>진단 신청 번호 :</strong> {petCareVo.diagnosisReqId ?? "-"}
        </p>

        <p>
          <strong>반려동물 번호 :</strong> {petCareVo.petId ?? "-"}
        </p>

        <p>
          <strong>진행 상태 :</strong> {petCareVo.diagnosisReqStatus ?? "-"}
        </p>

        <p>
          <strong>신청일 :</strong> {formatDate(petCareVo.createdAt)}
        </p>
      </InfoBox>

      <Section>
        <h2>답변 목록</h2>

        {!petCareVo.answerList || petCareVo.answerList.length === 0 ? (
          <EmptyText>답변이 없습니다.</EmptyText>
        ) : (
          petCareVo.answerList.map((answer, idx) => (
            <AnswerBox key={idx}>
              <p>
                <strong>질문 번호 :</strong> {answer.questionId}
              </p>
              <p>
                <strong>답변 :</strong> {answer.answerValue}
              </p>
            </AnswerBox>
          ))
        )}
      </Section>

      <Section>
        <h2>업로드 이미지</h2>

        {!petCareVo.fileList || petCareVo.fileList.length === 0 ? (
          <EmptyText>업로드된 이미지가 없습니다.</EmptyText>
        ) : (
          <ImageWrap>
            {petCareVo.fileList.map((file) => (
              <ImageBox key={file.imgId}>
                <p>{file.category}</p>

                <div className="file-name">
                  {file.imageOriginName || file.imageChangedName}
                </div>
              </ImageBox>
            ))}
          </ImageWrap>
        )}
      </Section>
    </Wrapper>
  );
}

export default DiagnosisDetailPage;

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 24px;

  h1 {
    margin-bottom: 24px;
    font-size: 28px;
    font-weight: 700;
  }
`;

const InfoBox = styled.div`
  background: #f8fffc;
  border: 1px solid #d9f3ea;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 32px;

  p {
    margin-bottom: 10px;
  }

  strong {
    color: #333;
  }
`;

const Section = styled.div`
  margin-bottom: 40px;

  h2 {
    margin-bottom: 16px;
    font-size: 22px;
  }
`;

const AnswerBox = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  background: white;

  p {
    margin-bottom: 8px;
  }
`;

const ImageWrap = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const ImageBox = styled.div`
  width: 200px;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 14px;
  background: white;

  p {
    font-weight: 700;
    margin-bottom: 8px;
    color: #00a97b;
  }

  .file-name {
    font-size: 14px;
    color: #555;
    word-break: break-all;
  }
`;

const EmptyText = styled.p`
  color: #777;
`;
