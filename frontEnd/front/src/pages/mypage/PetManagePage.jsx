import { useEffect, useState } from "react";
import styled from "styled-components";
import MyPageLayout from "./components/MyPageLayout";
import usePet from "../../features/mypage/pet/hooks/usePet";

export default function PetManagePage() {
  const {
    petList,
    breedList,
    selectedPet,
    selectedPetIndex,
    hasPet,
    loading,
    selectPet,
    nextPet,
    handleCreatePet,
    fetchBreedList,
    handleUpdatePet,
    handleDeletePet,
  } = usePet();

  const emptyForm = {
    petType: "D",
    name: "",
    breedName: "",
    gender: "",
    birthDate: "",
    weight: "",
    representYn: "N",
  };
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [isCreateMode, setCreateMode] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const insuranceList = [];

  useEffect(() => {
    if (!selectedPet || isCreateMode) return;

    setFormData({
      petType: selectedPet.petType || "D",
      name: selectedPet.name || "",
      breedName: selectedPet.breedName || "",
      gender: selectedPet.gender || "",
      birthDate: selectedPet.birthDate || "",
      weight: selectedPet.weight || "",
      representYn: selectedPet.representYn || "N",
    });
  }, [selectedPet, isCreateMode]);
  useEffect(() => {
    if (!loading && !hasPet) {
      setCreateMode(true);
      setDetailOpen(true);
      setFormData(emptyForm);
    }
  }, [loading, hasPet]);
  async function handleChange(evt) {
    const { name, value } = evt.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "petType" ? { breedName: "" } : {}),
    }));

    if (name === "petType") {
      await fetchBreedList(value);
    }
  }
  function handleSelectPet(index) {
    selectPet(index);
    setCreateMode(false);
    setDetailOpen(true);
  }

  function handleCreateMode() {
    setCreateMode(true);
    setDetailOpen(true);
    setFormData(emptyForm);
  }

  function handleSelectPet(index) {
    selectPet(index);
    setCreateMode(false);
  }

  function handleCreateMode() {
    setCreateMode(true);
    setFormData(emptyForm);
  }
  async function handleDelete() {
    if (!selectedPet) {
      return;
    }

    const result = confirm("정말 삭제하시겠습니까?");

    if (!result) {
      return;
    }

    const isSuccess = await handleDeletePet(selectedPet.petId);

    if (isSuccess) {
      alert("삭제되었습니다.");

      setDetailOpen(false);
    }
  }
  async function handleSubmit(evt) {
    evt.preventDefault();

    if (!formData.name.trim()) {
      alert("이름을 입력하세요.");
      return;
    }

    if (!formData.breedName.trim()) {
      alert("품종을 입력하세요.");
      return;
    }

    if (!formData.gender) {
      alert("성별을 선택하세요.");
      return;
    }

    if (isCreateMode) {
      const result = await handleCreatePet(formData);

      if (result) {
        alert("반려동물이 등록되었습니다.");
        setCreateMode(false);
      }

      return;
    }

    const result = await handleUpdatePet(selectedPet.petId, formData);

    if (result) {
      alert("수정되었습니다.");
    }
  }

  return (
    <MyPageLayout>
      <Title>반려동물 정보 관리</Title>

      {loading ? (
        <LoadingBox>로딩중...</LoadingBox>
      ) : (
        <>
          <PetTabs>
            {petList.map((pet, index) => (
              <PetTab
                key={pet.petId}
                $active={!isCreateMode && selectedPetIndex === index}
                onClick={() => handleSelectPet(index)}
              >
                <PetThumb />
                <PetName>{pet.name}</PetName>
                {pet.representYn === "Y" && <RepresentBadge>♥</RepresentBadge>}
              </PetTab>
            ))}

            <AddPetBox
              type="button"
              $active={isCreateMode}
              onClick={handleCreateMode}
            >
              +
            </AddPetBox>

            {petList.length > 1 && <NextBtn onClick={nextPet}>›</NextBtn>}
          </PetTabs>
          {isDetailOpen && (
            <DetailGrid>
              <PetFormCard onSubmit={handleSubmit}>
                <SectionTitle>
                  {isCreateMode ? "반려동물 등록" : "반려동물 수정"}
                </SectionTitle>

                <InfoRow>
                  <span>이름</span>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </InfoRow>
                <InfoRow>
                  <span>종류</span>
                  <Select
                    name="petType"
                    value={formData.petType}
                    onChange={handleChange}
                  >
                    <option value="D">강아지</option>
                    <option value="C">고양이</option>
                  </Select>
                </InfoRow>
                <InfoRow>
                  <span>품종</span>
                  <Select
                    name="breedName"
                    value={formData.breedName}
                    onChange={handleChange}
                  >
                    <option value="">품종 선택</option>

                    {breedList.map((breed) => (
                      <option key={breed.breedId} value={breed.breedName}>
                        {breed.breedName}
                      </option>
                    ))}
                  </Select>
                </InfoRow>

                <InfoRow>
                  <span>성별</span>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">선택</option>
                    <option value="M">남아</option>
                    <option value="F">여아</option>
                  </Select>
                </InfoRow>

                <InfoRow>
                  <span>생년월일</span>
                  <Input
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    placeholder="2021.03.15"
                  />
                </InfoRow>

                <InfoRow>
                  <span>몸무게</span>
                  <Input
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="4.2"
                  />
                </InfoRow>

                <InfoRow>
                  <span>대표동물</span>
                  <Select
                    name="representYn"
                    value={formData.representYn}
                    onChange={handleChange}
                  >
                    <option value="Y">대표</option>
                    <option value="N">일반</option>
                  </Select>
                </InfoRow>

                <ButtonRow>
                  {isCreateMode ? (
                    <Button type="submit">등록하기</Button>
                  ) : (
                    <>
                      <Button type="submit">수정하기</Button>
                      <Button type="button" onClick={handleDelete}>
                        삭제하기
                      </Button>
                    </>
                  )}
                </ButtonRow>
              </PetFormCard>

              <InsuranceCard>
                <SectionTitle>반려동물 보험</SectionTitle>

                {insuranceList.length > 0 ? (
                  <div>보험 정보 영역</div>
                ) : (
                  <EmptyInsurance>가입한 보험이 없습니다</EmptyInsurance>
                )}
              </InsuranceCard>
            </DetailGrid>
          )}
        </>
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
  background: white;
  color: #00b894;
  border-radius: 50%;
  padding: 3px 7px;
`;

const AddPetBox = styled.button`
  width: 130px;
  height: 145px;
  border-radius: 10px;
  border: 2px solid ${({ $active }) => ($active ? "#00a982" : "#bbb")};
  background: ${({ $active }) => ($active ? "#d9f6ec" : "#eee")};
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

const PetFormCard = styled.form`
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
  outline: none;
`;

const Select = styled.select`
  flex: 1;
  height: 34px;
  border: none;
  border-radius: 999px;
  background: #d9f2e7;
  padding: 0 18px;
  outline: none;
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
