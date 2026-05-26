import styled from "styled-components";
import MyPageLayout from "./components/MyPageLayout";
import usePet from "../../features/mypage/pet/hooks/usePet";

export default function PetManagePage() {
  const {
    petList,
    selectedPet,
    selectedPetIndex,
    hasPet,
    loading,
    selectPet,
    nextPet,
  } = usePet();

  const insuranceList = [];

  return (
    <MyPageLayout>
      <Title>반려동물 정보 관리</Title>

      {loading ? (
        <LoadingBox>로딩중...</LoadingBox>
      ) : hasPet ? (
        <>
          <PetTabs>
            {petList.map((pet, index) => (
              <PetTab
                key={pet.petId}
                $active={selectedPetIndex === index}
                onClick={() => selectPet(index)}
              >
                <PetThumb />
                <PetName>{pet.name}</PetName>
                {pet.representYn === "Y" && <RepresentBadge>✓</RepresentBadge>}
              </PetTab>
            ))}

            <AddPetBox>+</AddPetBox>

            {petList.length > 1 && <NextBtn onClick={nextPet}>›</NextBtn>}
          </PetTabs>

          <DetailGrid>
            <PetDetailCard>
              <SectionTitle>반려동물 수정</SectionTitle>

              <InfoRow>
                <span>이름</span>
                <Input value={selectedPet.name || ""} readOnly />
              </InfoRow>

              <InfoRow>
                <span>품종</span>
                <Input value={selectedPet.breedName || ""} readOnly />
              </InfoRow>

              <InfoRow>
                <span>성별</span>
                <Input value={selectedPet.gender || ""} readOnly />
              </InfoRow>

              <InfoRow>
                <span>생년월일</span>
                <Input value={selectedPet.birthDate || ""} readOnly />
              </InfoRow>

              <InfoRow>
                <span>몸무게</span>
                <Input value={`${selectedPet.weight || ""}kg`} readOnly />
              </InfoRow>

              <ButtonRow>
                <Button>수정하기</Button>
                <Button>삭제하기</Button>
              </ButtonRow>
            </PetDetailCard>

            <InsuranceCard>
              <SectionTitle>반려동물 보험</SectionTitle>

              {insuranceList.length > 0 ? (
                <div>보험 정보 영역</div>
              ) : (
                <EmptyInsurance>가입한 보험이 없습니다</EmptyInsurance>
              )}
            </InsuranceCard>
          </DetailGrid>
        </>
      ) : (
        <EmptyPetBox>
          <h3>등록된 반려동물이 없습니다</h3>
          <AddButton>반려동물 등록하기</AddButton>
        </EmptyPetBox>
      )}
    </MyPageLayout>
  );
}

const Title = styled.h1`
  font-size: 32px;
  color: #00a982;
  margin-bottom: 24px;
`;

const LoadingBox = styled.div`
  padding: 80px;
  text-align: center;
  color: #777;
`;

const PetTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: white;
  margin-bottom: 24px;
`;

const PetTab = styled.button`
  position: relative;
  width: 130px;
  height: 145px;
  border-radius: 10px;
  border: 2px solid ${({ $active }) => ($active ? "#00a982" : "#cdeee4")};
  background: ${({ $active }) => ($active ? "#00b894" : "white")};
  cursor: pointer;
`;

const PetThumb = styled.div`
  width: 82px;
  height: 82px;
  border-radius: 50%;
  margin: 12px auto 10px;
  background: #ddd;
`;

const PetName = styled.div`
  font-weight: 700;
`;

const RepresentBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #00b894;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
`;

const AddPetBox = styled.button`
  width: 130px;
  height: 145px;
  border-radius: 10px;
  border: 2px solid #bbb;
  background: #eee;
  font-size: 32px;
  cursor: pointer;
`;

const NextBtn = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  font-size: 28px;
  cursor: pointer;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
`;

const PetDetailCard = styled.section`
  background: #e9fbf4;
  border: 2px solid #00a3ff;
  border-radius: 8px;
  padding: 28px;
`;

const InsuranceCard = styled.section`
  background: #e9fbf4;
  border-radius: 8px;
  padding: 28px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;

  span {
    width: 90px;
    font-size: 14px;
    color: #555;
  }
`;

const Input = styled.input`
  flex: 1;
  height: 34px;
  border: none;
  border-radius: 999px;
  background: #d9f2e7;
  padding: 0 18px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  border: none;
  border-radius: 999px;
  padding: 10px 32px;
  background: white;
  color: #00a982;
  font-weight: 700;
  cursor: pointer;
`;

const EmptyInsurance = styled.div`
  height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-weight: 700;
`;

const EmptyPetBox = styled.div`
  height: 420px;
  border-radius: 14px;
  background: white;
  border: 1px solid #e5e5e5;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;

  h3 {
    color: #777;
  }
`;

const AddButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 12px 36px;
  background: #00b894;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;
