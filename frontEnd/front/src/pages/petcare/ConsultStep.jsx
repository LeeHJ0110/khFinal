import styled from "styled-components";

function ConsultStep({ question, value, onChange }) {
  if (!question) {
    return <Empty>상담 내용 문항이 등록되어 있지 않습니다.</Empty>;
  }

  return (
    <Section>
      <Category>수의사 상담 내용</Category>

      <Title>반려동물의 상태와 궁금한 점을 적어 주세요.</Title>

      <TextArea
        maxLength={1000}
        value={value}
        placeholder="최대 1000자까지 입력할 수 있어요.."
        onChange={(e) => onChange(question.questionId, e.target.value)}
      />
    </Section>
  );
}

export default ConsultStep;

const Section = styled.section`
  text-align: center;
`;

const Category = styled.p`
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 800;
`;

const Title = styled.h2`
  margin: 12px 0 24px;
  color: #222;
  font-size: 23px;
  font-weight: 500;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 180px;
  padding: 16px;
  border: 1px solid #cfded8;
  border-radius: 12px;
  box-sizing: border-box;
  font-size: 15px;
  line-height: 1.6;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #00a97b;
    box-shadow: 0 0 0 3px rgba(0, 169, 123, 0.12);
  }
`;

const Empty = styled.p`
  color: #777;
`;
