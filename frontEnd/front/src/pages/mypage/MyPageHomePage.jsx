import styled from "styled-components";
import MyPageLayout from "./components/MyPageLayout";
import usePet from "../../features/mypage/pet/hooks/usePet";

export default function MyPageHomePage() {
  const { selectedPet, hasPet, loading } = usePet();

  return (
    <MyPageLayout>
      <TopGrid>
        <MemberCard>
          <SectionTitle>회원 정보</SectionTitle>

          <InfoRow>
            <span>닉네임</span>
            <strong>냥냥러브</strong>
          </InfoRow>

          <InfoRow>
            <span>이메일</span>
            <strong>petrilobe@naver.com</strong>
          </InfoRow>

          <InfoRow>
            <span>연락처</span>
            <strong>010-4890-6219</strong>
          </InfoRow>

          <InfoRow>
            <span>가입일</span>
            <strong>2024.05.20</strong>
          </InfoRow>

          <EditButton>회원 정보 수정</EditButton>
        </MemberCard>

        <PetCard>
          {loading ? (
            <LoadingBox>로딩중...</LoadingBox>
          ) : hasPet ? (
            <>
              <PetImage />

              <PetInfo>
                <PetName>{selectedPet.name}</PetName>

                <InfoRow>
                  <span>품종</span>
                  <strong>{selectedPet.breedName}</strong>
                </InfoRow>

                <InfoRow>
                  <span>몸무게</span>
                  <strong>{selectedPet.weight}kg</strong>
                </InfoRow>

                <InfoRow>
                  <span>생년월일</span>
                  <strong>{selectedPet.birthDate}</strong>
                </InfoRow>

                <PetButton>반려동물 정보관리</PetButton>
              </PetInfo>
            </>
          ) : (
            <EmptyPetBox>
              <h3>등록된 반려동물이 없습니다</h3>

              <AddPetButton>반려동물 등록하기</AddPetButton>
            </EmptyPetBox>
          )}
        </PetCard>
      </TopGrid>

      <SummaryGrid>
        <SummaryCard>
          <IconCircle>♥</IconCircle>

          <div>
            <p>관심상품</p>
            <h2>12</h2>
          </div>
        </SummaryCard>

        <SummaryCard>
          <IconCircle>P</IconCircle>

          <div>
            <p>포인트</p>
            <h2>23,590P</h2>
          </div>
        </SummaryCard>

        <SummaryCard>
          <IconCircle>✉</IconCircle>

          <div>
            <p>쪽지함</p>
            <h2>미확인 쪽지 3개</h2>
          </div>
        </SummaryCard>

        <SummaryCard>
          <IconCircle>+</IconCircle>

          <div>
            <p>펫보험</p>
            <h2>가입된 보험 0개</h2>
          </div>
        </SummaryCard>
      </SummaryGrid>
    </MyPageLayout>
  );
}

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const MemberCard = styled.section`
  background: #e9fbf4;
  border-radius: 12px;
  padding: 30px;
`;

const PetCard = styled.section`
  background: #f6f6f6;
  border-radius: 12px;
  padding: 30px;

  display: flex;
  align-items: center;
  gap: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 22px;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 26px;
  margin-bottom: 14px;

  span {
    width: 80px;
    color: #777;
  }
`;

const EditButton = styled.button`
  margin-top: 18px;
  border: none;
  border-radius: 999px;
  padding: 10px 28px;
  background: white;
  color: #00a982;
  font-weight: 700;
  cursor: pointer;
`;

const PetImage = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: #ddd;
`;

const PetInfo = styled.div`
  flex: 1;
`;

const PetName = styled.h2`
  font-size: 36px;
  margin-bottom: 20px;
`;

const PetButton = styled.button`
  margin-top: 18px;
  border: none;
  border-radius: 999px;
  padding: 10px 28px;
  background: #e2fbf2;
  color: #00a982;
  font-weight: 700;
  cursor: pointer;
`;

const LoadingBox = styled.div`
  width: 100%;
  height: 260px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyPetBox = styled.div`
  width: 100%;
  height: 260px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 20px;

  h3 {
    color: #777;
  }
`;

const AddPetButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 12px 28px;
  background: #00b894;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

const SummaryGrid = styled.div`
  margin-top: 24px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;

  display: flex;
  align-items: center;
  gap: 20px;

  h2 {
    margin-top: 8px;
    font-size: 28px;
  }
`;

const IconCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #d9f6ec;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #00a982;
  font-size: 28px;
  font-weight: 700;
`;
