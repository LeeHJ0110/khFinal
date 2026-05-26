import styled from "styled-components";

export default function ScheduleModal({ open, onClose, schedule }) {
  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>일정 상세조회</Title>

          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Body>
          <Label>제목</Label>

          <Box>{schedule?.title}</Box>

          <Label>날짜</Label>

          <Box>{schedule?.start}</Box>

          <Label>내용</Label>

          <Content
            dangerouslySetInnerHTML={{
              __html: schedule?.content || "",
            }}
          />
        </Body>

        <Footer>
          <CancelButton onClick={onClose}>닫기</CancelButton>

          <SaveButton>수정</SaveButton>
        </Footer>
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
  width: 480px;

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

  font-size: 26px;

  cursor: pointer;

  color: #777;

  transition: 0.2s;

  &:hover {
    color: #111;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;

  gap: 10px;
`;

const Label = styled.p`
  margin: 0;

  font-size: 14px;
  font-weight: 600;

  color: #666;
`;

const Box = styled.div`
  padding: 14px 16px;

  border-radius: 14px;

  background: #f7f7f7;

  font-size: 15px;

  color: #222;
`;

const Content = styled.div`
  min-height: 140px;

  max-height: 240px;

  overflow-y: auto;

  padding: 16px;

  border-radius: 14px;

  background: #f7f7f7;

  line-height: 1.6;

  font-size: 14px;

  color: #333;

  img {
    max-width: 100%;

    border-radius: 12px;

    margin-top: 10px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;

  gap: 10px;

  margin-top: 28px;
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
