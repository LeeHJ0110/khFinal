import styled from "styled-components";
import useKarte from "../../features/karte/hooks/useKarte";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function KarteDetailPage() {
  const { isLoading, data, asyncFetchKarteDetail } = useKarte();
  const { id } = useParams();

  useEffect(() => {
    asyncFetchKarteDetail(id);
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
  };

  return (
    <Wrapper>
      {isLoading ? (
        <p>로딩중</p>
      ) : (
        <>
          <ContentRow>
            <PetCard>
              <PetImage />

              <PetInfo>
                <PetName>{data.pet?.name}</PetName>

                <InfoRow>
                  <span>품종</span>
                  <strong>{data.pet?.breed.name}</strong>
                </InfoRow>

                <InfoRow>
                  <span>몸무게</span>
                  <strong>{data.pet?.weight}kg</strong>
                </InfoRow>

                <InfoRow>
                  <span>생년월일</span>
                  <strong>{data.pet?.birthDate}</strong>
                </InfoRow>
              </PetInfo>
            </PetCard>

            <RightSection>
              <DateBadge>{formatDate(data.createdAt)}</DateBadge>

              <OpinionContainer>
                <OpinionHeader>진단 요약 내용</OpinionHeader>
                <OpinionContent>{data.opinion}</OpinionContent>
              </OpinionContainer>
            </RightSection>
          </ContentRow>
          <div>차트존</div>
          <div>의사소견</div>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div``;
const ContentRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: stretch;
`;
const PetCard = styled.section`
  width: 340px;

  padding: 24px;

  background: #f4f7f6;

  border-radius: 12px;

  display: flex;
  gap: 20px;
`;
const PetImage = styled.div`
  width: 110px;
  height: 110px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #ddd;

  border: 3px solid white;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
`;
const PetInfo = styled.div`
  flex: 1;
`;
const PetName = styled.h2`
  margin: 0 0 16px;

  font-size: 30px;
  font-weight: 700;
`;
const InfoRow = styled.div`
  display: flex;

  gap: 12px;

  margin-bottom: 8px;

  font-size: 14px;

  span {
    width: 60px;
    color: #666;
  }

  strong {
    color: #333;
  }
`;
const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 날짜 배지를 오른쪽으로 */
  gap: 16px;
`;

const DateBadge = styled.div`
  background-color: #5ec4a5; /* 이미지의 민트색상 */
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const OpinionContainer = styled.div`
  width: 100%;
  background-color: #e8e8e3; /* 회색빛 배경색 */
  border-radius: 16px;
  padding-top: 12px; /* 헤더 위치를 위한 여백 */
  position: relative;
  min-height: 150px;
`;

const OpinionHeader = styled.div`
  display: inline-block;
  background-color: #e8e8e3;
  padding: 10px 24px;
  border-radius: 20px 20px 0 0;
  font-size: 22px;
  font-weight: bold;
  color: #333;
  position: absolute;
  top: -24px; /* 박스 위로 살짝 걸치게 */
  left: 20px;
`;

const OpinionContent = styled.div`
  background-color: white;
  margin: 12px;
  margin-top: 24px; /* 헤더 아래쪽 공간 확보 */
  padding: 20px;
  border-radius: 8px;
  min-height: 100px;
  font-size: 16px;
  line-height: 1.6;
  color: #444;
  word-break: break-all;
  white-space: pre-wrap; /* 줄바꿈 유지 */
`;
