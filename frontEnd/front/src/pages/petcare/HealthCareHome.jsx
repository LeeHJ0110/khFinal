import styled from "styled-components";
import useKarte from "../../features/karte/hooks/useKarte";
import { useEffect, useState } from "react";
import usePet from "../../features/mypage/pet/hooks/usePet";
import PetCareNav from "../../features/petcare/components/petcarehome/PetCareNav";
import { useNavigate } from "react-router-dom";
// 필요정보 :펫리스트, 건강점수 평균, 일정표,
export default function HealthCareHome() {
  const { isLoading, data: karteData, asyncFetchKarteDetail } = useKarte();
  const { petList, loading, fetchMyPetList } = usePet();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const currentPet = petList?.[currentIndex];

  useEffect(() => {
    fetchMyPetList();
  }, []);

  //대표찾기
  useEffect(() => {
    if (!petList?.length) return;
    const representIndex = petList.findIndex((pet) => pet.representYn === "Y");
    setCurrentIndex(representIndex >= 0 ? representIndex : 0);
  }, [petList]);

  //넘기기 버튼
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + petList.length) % petList.length);
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % petList.length);
  };

  return (
    <>
      <PetCareNav />
      <Wrapper>
        <PetCard>
          {loading ? (
            <p>로딩중</p>
          ) : currentPet ? (
            <PetInfo>
              <PetName>{currentPet.name}</PetName>

              <InfoRow>
                <span>품종</span>
                <strong>{currentPet.breedName}</strong>
              </InfoRow>

              <InfoRow>
                <span>몸무게</span>
                <strong>{currentPet.weight}kg</strong>
              </InfoRow>

              <InfoRow>
                <span>생년월일</span>
                <strong>{currentPet.birthDate}</strong>
              </InfoRow>
              <div>
                <button onClick={handlePrev}>이전</button>

                <span>
                  {currentIndex + 1} / {petList.length}
                </span>

                <button onClick={handleNext}>다음</button>
              </div>
            </PetInfo>
          ) : (
            <p>등록된 반려동물이 없습니다</p>
          )}
        </PetCard>
        <div
          onClick={() => {
            navigate(`/healthCare/requestHome`);
          }}
        >
          신청 홈
        </div>
        <div
          onClick={() => {
            navigate(`/healthCare/schedule`);
          }}
        >
          스케줄
        </div>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.main`
  width: min(1180px, calc(100% - 48px));

  margin: 0 auto;
  padding: 52px 0 88px;

  box-sizing: border-box;
  background-color: gray;
`;

const PetCard = styled.section`
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
