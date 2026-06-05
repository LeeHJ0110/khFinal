import { useState } from "react";
import styled from "styled-components";

export default function AdminMessageSendModal({ member, onClose, onSend }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    reasonType: "NOTICE",
  });

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const isSuccess = await onSend({
      receiverId: member.memberId,
      title: formData.title,
      content: formData.content,
      reasonType: formData.reasonType,
    });

    if (isSuccess) {
      onClose();
    }
  }

  return (
    <Overlay>
      <ModalBox>
        <Header>
          <h2>쪽지 보내기</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Receiver>
          받는 사람:{" "}
          <strong>{member.nickname || member.username || "-"}</strong>
        </Receiver>

        <Form onSubmit={handleSubmit}>
          <Label>분류</Label>
          <Select
            name="reasonType"
            value={formData.reasonType}
            onChange={handleChange}
          >
            <option value="NOTICE">공지</option>
            <option value="SCHEDULE">일정</option>
            <option value="INSURANCE">보험</option>
            <option value="COMMUNITY">커뮤니티</option>
            <option value="AD">광고</option>
          </Select>

          <Label>제목</Label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="쪽지 제목"
          />

          <Label>내용</Label>
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="쪽지 내용을 입력하세요"
          />

          <ButtonArea>
            <CancelButton type="button" onClick={onClose}>
              취소
            </CancelButton>
            <SendButton type="submit">발송</SendButton>
          </ButtonArea>
        </Form>
      </ModalBox>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  width: 460px;
  padding: 24px;
  border-radius: 16px;
  background-color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
  }
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  font-size: 28px;
  cursor: pointer;
`;

const Receiver = styled.div`
  margin: 20px 0;
  padding: 12px;
  border-radius: 10px;
  background-color: #f8f8f8;
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 700;
`;

const Select = styled.select`
  height: 40px;
  margin-bottom: 14px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Input = styled.input`
  height: 40px;
  margin-bottom: 14px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Textarea = styled.textarea`
  height: 140px;
  margin-bottom: 16px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
`;

const ButtonArea = styled.div`
  display: flex;
  gap: 8px;
`;

const CancelButton = styled.button`
  flex: 1;
  height: 42px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
`;

const SendButton = styled.button`
  flex: 1;
  height: 42px;
  border: none;
  border-radius: 8px;
  background-color: #2563eb;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;
