import { useEffect, useState } from "react";
import styled from "styled-components";
import useScheduleWrite from "../hooks/useScheduleWrite";
import useScheduleDetail from "../hooks/useScheduleDetail";
import useScheduleEdit from "../hooks/useScheduleEdit";
import useScheduleDelete from "../hooks/useScheduleDelete";
import useFormData from "../../../shared/hooks/useFormData";

export default function ScheduleModal({ open, onClose, data }) {
  if (!open) return null;
  const { handleWrite, isSuccess: writeSucc } = useScheduleWrite();
  const { handleEdit, isSuccess: editSucc } = useScheduleEdit();
  const { handleDelete, isSuccess: delSucc } = useScheduleDelete();
  const { formData, handleChange } = useFormData(data);

  useEffect(() => {
    if (editSucc || writeSucc || delSucc) {
      onClose();
    }
  }, [writeSucc, editSucc, delSucc]);

  //error userEffect로 처리하기

  function displayEndDate(endDate) {
    if (!endDate) return "";

    const date = new Date(endDate);

    date.setDate(date.getDate() - 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>일정 상세조회</Title>

          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        <Body
          onSubmit={(e) => {
            e.preventDefault();
            const payload = {
              ...formData,
              backgroundColor: formData.backgroundColor.replace("#", ""),
            };
            if (data.isEdit) {
              handleEdit(payload);
              console.log("수정");
            } else {
              handleWrite(payload);
              console.log("등록");
            }
          }}
        >
          <Field>
            <Label>제목</Label>

            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Field>

          <Row>
            <Field>
              <Label>시작 날짜</Label>

              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label>종료 날짜</Label>

              <Input
                type="date"
                name="endDate"
                value={displayEndDate(formData.endDate)}
                onChange={handleChange}
              />
            </Field>
          </Row>
          <Row>
            <Select
              value={formData.at?.split(":")[0] || "00"}
              onChange={(e) => {
                const minute = formData.at?.split(":")[1] || "00";

                handleChange({
                  target: {
                    name: "at",
                    value: `${e.target.value}:${minute}`,
                  },
                });
              }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={String(i).padStart(2, "0")}>
                  {i}
                </option>
              ))}
            </Select>

            <Select
              value={formData.at?.split(":")[1] || "00"}
              onChange={(e) => {
                const hour = formData.at?.split(":")[0] || "00";

                handleChange({
                  target: {
                    name: "at",
                    value: `${hour}:${e.target.value}`,
                  },
                });
              }}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={String(i).padStart(2, "0")}>
                  {i}
                </option>
              ))}
            </Select>
          </Row>

          <Field>
            <Label>내용</Label>

            <TextArea
              value={formData.content}
              name="content"
              onChange={handleChange}
            />
            {/* <label htmlFor="file-input">파일첨부ㅋㅋ</label>
            <input
            id="file-input"
            type="file"
            name="f"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
            /> */}
          </Field>
          <Field>
            <Label>색상</Label>
            <ColorInput
              type="color"
              name="backgroundColor"
              value={formData.backgroundColor}
              onChange={handleChange}
            />
          </Field>
          <Footer>
            <CancelButton type="button" onClick={onClose}>
              취소
            </CancelButton>
            {data.isEdit ? (
              <>
                <DeleteButton
                  type="button"
                  onClick={() => {
                    handleDelete(data.id);
                    console.log("삭제");
                  }}
                >
                  삭제
                </DeleteButton>
                <SaveButton type="submit">수정</SaveButton>
              </>
            ) : (
              <SaveButton type="submit">저장</SaveButton>
            )}
          </Footer>
        </Body>
      </Container>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.4);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;
`;

const Container = styled.div`
  width: 520px;

  background: white;

  border-radius: 24px;

  padding: 28px;

  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);

  animation: modal-show 0.2s ease;

  @keyframes modal-show {
    from {
      opacity: 0;
      transform: translateY(8px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
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

  font-size: 22px;
  font-weight: 700;

  color: #222;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;

  font-size: 28px;

  cursor: pointer;

  color: #777;

  transition: 0.2s;

  &:hover {
    color: #111;
  }
`;

const Body = styled.form`
  display: flex;
  flex-direction: column;

  gap: 18px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;

  gap: 8px;
`;

const Row = styled.div`
  display: flex;

  gap: 12px;

  > div {
    flex: 1;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;

  color: #666;
`;

const Input = styled.input`
  height: 46px;
  border: 1px solid #a7fd91;
  border-radius: 14px;
  padding: 0 14px;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
  &:focus {
    border-color: #5ec8a7;
  }
`;

const TextArea = styled.textarea`
  min-height: 180px;

  border: 1px solid #a7fd91;

  border-radius: 14px;

  padding: 14px;

  resize: none;

  font-size: 14px;

  line-height: 1.5;

  outline: none;

  transition: 0.2s;

  &:focus {
    border-color: #5ec8a7;
  }
`;

const ColorInput = styled.input`
  width: 60px;
  height: 42px;

  border: none;

  background: transparent;

  cursor: pointer;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;

  gap: 10px;

  margin-top: 10px;
`;

const CancelButton = styled.button`
  border: none;

  padding: 12px 18px;

  border-radius: 12px;

  cursor: pointer;

  font-size: 14px;
  font-weight: 600;

  background: #f0f0f0;

  color: #444;

  transition: 0.2s;

  &:hover {
    background: #e5e5e5;
  }
`;

const SaveButton = styled.button`
  border: none;

  padding: 12px 18px;

  border-radius: 12px;

  cursor: pointer;

  font-size: 14px;
  font-weight: 600;

  background: #5ec8a7;

  color: white;

  transition: 0.2s;

  &:hover {
    background: #4eb394;
  }
`;
const DeleteButton = styled.button`
  border: none;
  padding: 12px 18px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  background: #ff4d4d;
  color: white;
  transition: 0.2s;

  &:hover {
    background: #e60000;
  }
`;

const Select = styled.select`
  flex: 1;

  height: 40px;

  padding: 0 12px;

  border: 1px solid #a7fd91;
  border-radius: 8px;
`;
