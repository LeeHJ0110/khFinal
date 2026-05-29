import styled from "styled-components";
import useTraining from "../hooks/useTraining";
import useFormData from "../../../shared/hooks/useFormData";
import { useEffect, useState } from "react";
import usePet from "../../mypage/pet/hooks/usePet";

export default function TrainingDiaryModal({ open, onClose, data }) {
  const { isLoading, openDetail, closeDetail, insertDiary } = useTraining();
  const { formData, handleChange } = useFormData(data);

  const { petList, fetchMyPetList } = usePet();

  console.log(formData);

  return (
    <Wrapper>
      {open && (
        <ModalOverlay onClick={onClose}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <Title>훈련일기 작성</Title>
            <Body
              onSubmit={(e) => {
                e.preventDefault();
                insertDiary(formData);
              }}
            >
              <Row>
                <Input
                  type="number"
                  min="0"
                  max="23"
                  placeholder="시간"
                  value={formData.trainingTime?.split(":")[0] || ""}
                  onChange={(e) => {
                    const minute = formData.trainingTime?.split(":")[1] || "00";

                    handleChange({
                      target: {
                        name: "trainingTime",
                        value: `${String(e.target.value).padStart(2, "0")}:${minute}`,
                      },
                    });
                  }}
                />

                <Input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="분"
                  value={formData.trainingTime?.split(":")[1] || ""}
                  onChange={(e) => {
                    const hour = formData.trainingTime?.split(":")[0] || "00";

                    handleChange({
                      target: {
                        name: "trainingTime",
                        value: `${hour}:${String(e.target.value).padStart(2, "0")}`,
                      },
                    });
                  }}
                />
              </Row>
              <TextArea
                value={formData.content}
                name="content"
                onChange={handleChange}
              />
              <div>펫 선택창</div>

              <ButtonGroup>
                <CancelButton onClick={onClose}>취소</CancelButton>

                <SubmitButton type="submit">저장</SubmitButton>
              </ButtonGroup>
            </Body>
          </ModalBox>
        </ModalOverlay>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div``;
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;

  background-color: rgba(0, 0, 0, 0.4);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 999;
`;

const ModalBox = styled.div`
  width: 500px;

  background-color: white;

  border-radius: 12px;

  padding: 24px;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  margin: 0;
`;

const Input = styled.input`
  height: 40px;

  padding: 0 12px;

  border: 1px solid #ddd;
  border-radius: 8px;
`;

const TextArea = styled.textarea`
  min-height: 200px;

  padding: 12px;

  border: 1px solid #ddd;
  border-radius: 8px;

  resize: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const Button = styled.button`
  height: 40px;

  padding: 0 16px;

  border: none;
  border-radius: 8px;

  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: #ddd;
`;

const SubmitButton = styled(Button)`
  background-color: #5ec8a7;
  color: white;
`;

const Row = styled.div`
  display: flex;

  gap: 12px;

  > div {
    flex: 1;
  }
`;
const Body = styled.form`
  display: flex;
  flex-direction: column;

  gap: 18px;
`;
