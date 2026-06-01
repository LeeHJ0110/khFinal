import styled from "styled-components";
import DEFAULT_PET_IMAGE from "../../features/petcare/img/건강진단 서브.png";

// 프로필 이미지 필드명이 확정되면 실제 필드 하나만 남겨도 됨
function getPetProfileImage(pet) {
  return (
    pet.profile ||
    pet.profileImage ||
    pet.profileImg ||
    pet.imgProfile ||
    pet.imageUrl ||
    DEFAULT_PET_IMAGE
  );
}

function PetSelectStep({
  memberInfo,
  petList,
  selectedPet,
  currentWeight,
  isWeightSaving,
  onSelectPet,
  onChangeWeight,
  onSaveWeight,
}) {
  // 펫이 5마리 이상이면 카드 크기를 조금 줄임
  const isCompact = petList.length > 4;

  return (
    <>
      <Description>
        {memberInfo?.nickname
          ? `${memberInfo.nickname}님, 건강진단을 신청할 반려동물을 선택해 주세요.`
          : "건강진단을 신청할 반려동물을 선택해 주세요."}
      </Description>

      {petList.length === 0 ? (
        <EmptyMessage>
          등록된 반려동물이 없습니다.
          <br />
          반려동물을 먼저 등록해 주세요.
        </EmptyMessage>
      ) : (
        <PetCardList $compact={isCompact}>
          {petList.map((pet) => {
            // 진행 중인 건강진단 신청이 있는 펫
            const isApplying =
              pet.diagnosisInProgress === true;

            // 신청 중인 펫은 선택 상태가 될 수 없음
            const isSelected =
              !isApplying &&
              selectedPet?.petId === pet.petId;

            return (
              <PetCard
                key={pet.petId}
                type="button"
                disabled={isApplying}
                $selected={isSelected}
                $applying={isApplying}
                $compact={isCompact}
                onClick={() => {
                  if (isApplying) {
                    return;
                  }

                  onSelectPet(pet);
                }}
              >
                {isApplying ? (
                  <ApplyingBadge>
                    신청 중
                  </ApplyingBadge>
                ) : (
                  <SelectedMark $selected={isSelected}>
                    {isSelected ? "♥" : "♡"}
                  </SelectedMark>
                )}

                <PetImageWrapper
                  $compact={isCompact}
                  $applying={isApplying}
                >
                  <PetImage
                    src={getPetProfileImage(pet)}
                    alt={`${pet.name ?? "반려동물"} 프로필 이미지`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_PET_IMAGE;
                    }}
                  />
                </PetImageWrapper>

                <PetName
                  $selected={isSelected}
                  $applying={isApplying}
                  $compact={isCompact}
                >
                  {pet.name ?? "이름 미등록"}
                </PetName>

                <PetInfo
                  $selected={isSelected}
                  $applying={isApplying}
                  $compact={isCompact}
                >
                  {pet.breedName ?? "품종 미등록"}
                </PetInfo>

                {isApplying && (
                  <ApplyingText>
                    건강진단이 진행 중입니다.
                  </ApplyingText>
                )}
              </PetCard>
            );
          })}
        </PetCardList>
      )}

      {selectedPet && (
        <WeightSection>
          <WeightHeader>
            <WeightTitle>현재 체중 확인</WeightTitle>

            <WeightDescription>
              정확한 건강 상태 분석을 위해 현재 체중을 입력해 주세요.
            </WeightDescription>
          </WeightHeader>

          <WeightContent>
            <WeightInfoBox>
              <WeightLabel>기록된 체중</WeightLabel>

              <RecordedWeight>
                {selectedPet.weight != null
                  ? `${selectedPet.weight}kg`
                  : "미등록"}
              </RecordedWeight>
            </WeightInfoBox>

            <WeightInputBox>
              <WeightLabel htmlFor="currentWeight">
                현재 체중
              </WeightLabel>

              <WeightInputRow>
                <WeightInput
                  id="currentWeight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) =>
                    onChangeWeight(e.target.value)
                  }
                />

                <WeightUnit>kg</WeightUnit>

                <WeightSaveButton
                  type="button"
                  disabled={isWeightSaving}
                  onClick={onSaveWeight}
                >
                  {isWeightSaving
                    ? "저장 중"
                    : "저장"}
                </WeightSaveButton>
              </WeightInputRow>
            </WeightInputBox>
          </WeightContent>
        </WeightSection>
      )}
    </>
  );
}

export default PetSelectStep;

const Description = styled.p`
  margin: 0 0 18px;
  color: #555;
  font-size: 15px;
  font-weight: 500;
`;

const EmptyMessage = styled.div`
  padding: 58px 24px;
  border: 1px solid #dfe8e4;
  border-radius: 14px;
  background: #ffffff;
  color: #777;
  line-height: 1.8;
  text-align: center;
`;

const PetCardList = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ $compact }) =>
    $compact ? "16px" : "20px"};
  padding: ${({ $compact }) =>
    $compact ? "18px" : "20px"};
  border: 1px solid #dfe8e4;
  border-radius: 14px;
  background: #ffffff;
  box-sizing: border-box;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const PetCard = styled.button`
  position: relative;

  width: 100%;
  min-width: 0;
  min-height: ${({ $compact }) =>
    $compact ? "190px" : "224px"};

  padding: ${({ $compact }) =>
    $compact
      ? "16px 12px"
      : "22px 16px 18px"};

  border: 1px solid
    ${({ $selected, $applying }) => {
      if ($selected) return "#00a97b";
      if ($applying) return "rgba(0, 169, 123, 0.22)";

      return "#dce5e1";
    }};

  border-radius: 14px;

  background: ${({ $selected, $applying }) => {
    if ($selected) return "#00a97b";
    if ($applying) return "rgba(0, 169, 123, 0.055)";

    return "#ffffff";
  }};

  box-shadow: ${({ $selected }) =>
    $selected
      ? "0 8px 18px rgba(0, 169, 123, 0.2)"
      : "0 3px 10px rgba(0, 0, 0, 0.04)"};

  cursor: ${({ $applying }) =>
    $applying ? "default" : "pointer"};

  opacity: ${({ $applying }) =>
    $applying ? "0.88" : "1"};

  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #00a97b;
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(0, 169, 123, 0.14);
  }
`;

const SelectedMark = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;

  display: flex;
  width: 25px;
  height: 25px;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #ffffff;

  color: ${({ $selected }) =>
    $selected ? "#00a97b" : "#b7d8ce"};

  font-size: 17px;
  font-weight: 900;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const ApplyingBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;

  padding: 5px 9px;

  border: 1px solid rgba(0, 169, 123, 0.22);
  border-radius: 999px;

  background: rgba(0, 169, 123, 0.1);
  color: #008f69;

  font-size: 11px;
  font-weight: 800;
`;

const PetImageWrapper = styled.div`
  display: flex;

  width: ${({ $compact }) =>
    $compact ? "96px" : "128px"};

  height: ${({ $compact }) =>
    $compact ? "96px" : "128px"};

  margin: 0 auto;

  align-items: center;
  justify-content: center;

  overflow: hidden;

  border: 4px solid
    ${({ $applying }) =>
      $applying
        ? "rgba(0, 169, 123, 0.12)"
        : "rgba(255, 255, 255, 0.88)"};

  border-radius: 50%;

  background: #f3f7f5;

  box-sizing: border-box;
`;

const PetImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PetName = styled.p`
  margin: ${({ $compact }) =>
    $compact
      ? "11px 0 0"
      : "15px 0 0"};

  color: ${({ $selected, $applying }) => {
    if ($selected) return "#ffffff";
    if ($applying) return "#008f69";

    return "#222";
  }};

  font-size: ${({ $compact }) =>
    $compact ? "15px" : "18px"};

  font-weight: 800;

  text-align: center;
  letter-spacing: -0.5px;
  word-break: keep-all;
`;

const PetInfo = styled.p`
  margin: 7px 0 0;

  color: ${({ $selected, $applying }) => {
    if ($selected) {
      return "rgba(255, 255, 255, 0.82)";
    }

    if ($applying) {
      return "#6f8f86";
    }

    return "#777";
  }};

  font-size: ${({ $compact }) =>
    $compact ? "12px" : "13px"};

  text-align: center;
  word-break: keep-all;
`;

const ApplyingText = styled.p`
  margin: 9px 0 0;

  color: #008f69;

  font-size: 11px;
  font-weight: 700;

  text-align: center;
`;

const WeightSection = styled.section`
  margin-top: 22px;
  padding: 22px 24px;

  border: 1px solid #e0ebe7;
  border-radius: 14px;

  background: #f8fcfa;
`;

const WeightHeader = styled.div`
  padding-bottom: 16px;
  border-bottom: 1px solid #e0ebe7;
`;

const WeightTitle = styled.h2`
  margin: 0 0 6px;
  color: #222;
  font-size: 18px;
  font-weight: 800;
`;

const WeightDescription = styled.p`
  margin: 0;
  color: #777;
  font-size: 13px;
`;

const WeightContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 52px;
  padding-top: 18px;
`;

const WeightInfoBox = styled.div`
  display: flex;
  min-width: 150px;
  flex-direction: column;
  gap: 9px;
`;

const WeightInputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const WeightLabel = styled.label`
  color: #666;
  font-size: 13px;
  font-weight: 700;
`;

const RecordedWeight = styled.strong`
  color: #00a97b;
  font-size: 21px;
  font-weight: 800;
`;

const WeightInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WeightInput = styled.input`
  width: 120px;
  height: 38px;

  padding: 0 12px;

  border: 1px solid #cfded8;
  border-radius: 7px;

  background: #ffffff;

  box-sizing: border-box;

  font-size: 15px;

  outline: none;

  &:focus {
    border-color: #00a97b;
    box-shadow: 0 0 0 3px rgba(0, 169, 123, 0.12);
  }
`;

const WeightUnit = styled.span`
  color: #555;
  font-size: 14px;
  font-weight: 700;
`;

const WeightSaveButton = styled.button`
  height: 38px;

  padding: 0 18px;

  border: none;
  border-radius: 7px;

  background: #00a97b;
  color: #ffffff;

  font-size: 14px;
  font-weight: 800;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover:not(:disabled) {
    background: #008f69;
  }

  &:disabled {
    background: #9dcfc0;
    cursor: default;
  }
`;