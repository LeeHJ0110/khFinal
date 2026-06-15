import styled from "styled-components";
import useTraining from "../hooks/useTraining";
import useFormData from "../../../shared/hooks/useFormData";
import { useEffect, useState } from "react";
import usePet from "../../mypage/pet/hooks/usePet";

export default function TrainingDiaryModal({ open, onClose, data }) {
  if (!open) return null;

  const { isSuccess, insertDiary, editDiary, deleteDiary } = useTraining();
  const { formData, handleChange } = useFormData(data);
  const { petList, loading, fetchMyPetList } = usePet();

  // 선택된 반려동물 ID 배열을 관리하는 로컬 상태
  const [checkedPetIds, setCheckedPetIds] = useState([]);

  useEffect(() => {
    if (open && data) {
      setCheckedPetIds(data.trainingPetList || data.petList || []);
    }
  }, [open, data]);

  useEffect(() => {
    fetchMyPetList();
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  // 반려동물 체크박스 칩 선택/해제 핸들러
  const handlePetToggle = (petId) => {
    setCheckedPetIds((prev) => {
      const isChecked = prev.includes(petId);
      return isChecked ? prev.filter((id) => id !== petId) : [...prev, petId];
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            {formData?.isEdit ? "훈련일기 상세조회" : "훈련일기 작성"}
          </Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        {/* 💡 기존의 중첩 태그 오류를 해결하고 올바른 대문자 Body 폼 컴포넌트로 결합 */}
        <Body
          onSubmit={(e) => {
            e.preventDefault();

            const payload = {
              ...formData,
              trainingPetList: checkedPetIds,
              petList: checkedPetIds,
            };

            if (!formData.content || formData.content.trim() === "") {
              alert("일기 내용을 입력해주세요");
              return;
            }

            if (formData.isEdit) {
              editDiary(payload);
            } else {
              insertDiary(payload);
            }
          }}
        >
          {/* 운동 시간 설정 */}
          <Field>
            <Label>운동 시간</Label>
            <Row>
              <Select
                value={formData.trainingTime?.split(":")[0] || "00"}
                onChange={(e) => {
                  const minute = formData.trainingTime?.split(":")[1] || "00";
                  handleChange({
                    target: {
                      name: "trainingTime",
                      value: `${e.target.value}:${minute}`,
                    },
                  });
                }}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {i}시간
                  </option>
                ))}
              </Select>

              <Select
                value={formData.trainingTime?.split(":")[1] || "00"}
                onChange={(e) => {
                  const hour = formData.trainingTime?.split(":")[0] || "00";
                  handleChange({
                    target: {
                      name: "trainingTime",
                      value: `${hour}:${e.target.value}`,
                    },
                  });
                }}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {i}분
                  </option>
                ))}
              </Select>
            </Row>
          </Field>

          {/* 훈련 일기 내용 입력 */}
          <Field>
            <Label>내용</Label>
            <TextArea
              placeholder="오늘 진행한 훈련 행동이나 댕댕이의 운동 상태를 기록해 보세요."
              value={formData.content || ""}
              name="content"
              onChange={handleChange}
            />
          </Field>

          {/* 함께 한 반려동물 선택 리스트 */}
          <Field>
            <Label>함께 한 반려동물</Label>
            {loading ? (
              <LoadingText>반려동물 목록을 불러오는 중입니다...</LoadingText>
            ) : (
              <PetCheckList>
                {petList?.map((pet) => {
                  const isChecked = checkedPetIds.includes(pet.petId);
                  return (
                    <PetCheckItem
                      key={pet.petId}
                      $checked={isChecked}
                      onClick={() => handlePetToggle(pet.petId)}
                    >
                      {isChecked ? "🐾 " : ""}
                      {pet.name}
                    </PetCheckItem>
                  );
                })}
              </PetCheckList>
            )}
          </Field>

          {/* 하단 제어 버튼 그룹 */}
          <Footer>
            <CancelButton type="button" onClick={onClose}>
              취소
            </CancelButton>
            {formData.isEdit ? (
              <>
                <DeleteButton
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm("정말로 이 훈련일기를 삭제하시겠습니까?")
                    ) {
                      const finalFormData = {
                        ...formData,
                        trainingPetList: checkedPetIds,
                        petList: checkedPetIds,
                      };
                      deleteDiary(finalFormData);
                    }
                  }}
                >
                  삭제
                </DeleteButton>
                <SaveButton type="submit">수정 완료</SaveButton>
              </>
            ) : (
              <SaveButton type="submit">일기 저장</SaveButton>
            )}
          </Footer>
        </Body>
      </ModalBox>
    </ModalOverlay>
  );
}

// ==========================================
// 디자인 싱크로율 100% 스타일드 컴포넌트 정의
// ==========================================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
`;

const ModalBox = styled.div`
  width: 500px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 32px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modal-show 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes modal-show {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 26px;
  font-weight: 300;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.2s;
  line-height: 1;

  &:hover {
    color: #475569;
    transform: rotate(90deg);
  }
`;

const Body = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  gap: 14px;
  > div {
    flex: 1;
  }
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  margin-left: 2px;
`;

const Select = styled.select`
  flex: 1;
  height: 46px;
  padding: 0 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  color: #334155;
  outline: none;
  background-color: #ffffff;
  transition: all 0.2s;

  &:focus {
    border-color: #5ec8a7;
    box-shadow: 0 0 0 4px rgba(94, 200, 167, 0.12);
  }
`;

const TextArea = styled.textarea`
  min-height: 160px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  resize: none;
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  outline: none;
  transition: all 0.2s ease-in-out;

  &::placeholder {
    color: #cbd5e1;
  }

  &:focus {
    border-color: #5ec8a7;
    box-shadow: 0 0 0 4px rgba(94, 200, 167, 0.12);
  }
`;

const LoadingText = styled.p`
  font-size: 14px;
  color: #94a3b8;
  margin: 8px 0;
  padding-left: 2px;
`;

const PetCheckList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 168px;
  overflow-y: auto;
  padding: 4px 2px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const PetCheckItem = styled.div`
  padding: 8px 16px;
  border-radius: 999px;
  border: 1.5px solid ${({ $checked }) => ($checked ? "#5ec8a7" : "#e2e8f0")};
  background: ${({ $checked }) => ($checked ? "#5ec8a7" : "#ffffff")};
  color: ${({ $checked }) => ($checked ? "#ffffff" : "#475569")};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
  box-shadow: ${({ $checked }) =>
    $checked ? "0 4px 10px rgba(94, 200, 167, 0.2)" : "none"};
  transition: all 0.15s ease-in-out;

  &:hover {
    border-color: #5ec8a7;
    color: ${({ $checked }) => ($checked ? "#ffffff" : "#5ec8a7")};
    background: ${({ $checked }) => ($checked ? "#4eb394" : "#f0fbf8")};
  }

  &:active {
    transform: scale(0.96);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
`;

const BaseButton = styled.button`
  border: none;
  padding: 12px 22px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.2s ease-in-out;
  user-select: none;

  &:active {
    transform: scale(0.97);
  }
`;

const CancelButton = styled(BaseButton)`
  background: #f1f5f9;
  color: #64748b;

  &:hover {
    background: #e2e8f0;
    color: #475569;
  }
`;

const SaveButton = styled(BaseButton)`
  background: #5ec8a7;
  color: white;
  box-shadow: 0 4px 12px rgba(94, 200, 167, 0.15);

  &:hover {
    background: #4eb394;
    box-shadow: 0 6px 16px rgba(94, 200, 167, 0.25);
  }
`;

const DeleteButton = styled(BaseButton)`
  background: #fee2e2;
  color: #ef4444;
  margin-right: auto;

  &:hover {
    background: #fca5a5;
    color: #b91c1c;
  }
`;
