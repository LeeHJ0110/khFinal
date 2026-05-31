import styled from "styled-components";

function ConsultStep({
  question,
  value,
  onChange,
}) {
  if (!question) {
    return (
      <Empty>
        상담 내용 문항이 등록되어 있지 않습니다.
      </Empty>
    );
  }

  return (
    <Section>
      <Category>기타 특이사항</Category>

      <Title>
        추가로 상담하고 싶은 내용을 입력해 주세요.
      </Title>

      <TextArea
        value={value}
        placeholder="수의사에게 전달하고 싶은 내용을 입력해 주세요."
        onChange={(e) =>
          onChange(question.questionId, e.target.value)
        }
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