import styled from "styled-components";
import consultImage from "../../features/petcare/img/수의사검토.png";

function ConsultStep({ question, value, onChange }) {
  if (!question) {
    return <Empty>상담 내용 문항이 등록되어 있지 않습니다.</Empty>;
  }

  const currentLength = value?.length ?? 0;

  return (
    <Section>
      <CategoryImage
        src={consultImage}
        alt="수의사 상담"
      />

      <Category>수의사 상담 내용</Category>

      <Title>
        반려동물의 증상, 생활 변화, 궁금한 점을 적어 주세요.
      </Title>

      <GuideText>
        상담에 참고할 수 있도록 최대 1000자 이내로 작성해 주세요.
      </GuideText>

     <TextAreaWrap>
  <TextArea
    maxLength={1000}
    value={value ?? ""}
    placeholder="예) 최근 식욕, 배변, 활동량, 피부·눈·치아 상태 등 평소와 달라진 점을 적어 주세요."
    onChange={(e) => onChange(question.questionId, e.target.value)}
  />

  <TextCount $isLimit={currentLength >= 1000}>
    {currentLength}/1000자
  </TextCount>
</TextAreaWrap>
    </Section>
  );
}

export default ConsultStep;

const Section = styled.section`
  text-align: center;

  padding-top: 6px;
`;

const CategoryImage = styled.img`
  display: block;

  width: 64px;
  height: 64px;

  margin: 0 auto 12px;

  object-fit: contain;
`;

const Category = styled.p`
  margin: 0;

  color: #333333;

  font-size: 20px;
  font-weight: 800;
`;

const Title = styled.h2`
  margin: 12px 0 8px;

  color: #222222;

  font-size: 23px;
  font-weight: 600;
  line-height: 1.45;

  word-break: keep-all;
`;

const GuideText = styled.p`
  width: fit-content;
  max-width: 620px;

  margin: 0 auto 20px;
  padding: 7px 12px;

  border-radius: 999px;

  background: #f3faf7;

  color: #5f7770;

  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;

  word-break: keep-all;
`;

const TextAreaWrap = styled.div`
  width: 100%;
  max-width: 760px;

  margin: 0 auto;
`;

const TextArea = styled.textarea`
  display: block;

  width: 100%;
  height: 190px;

  padding: 18px;

  border: 1px solid #d7e5df;
  border-radius: 16px;

  background: #ffffff;

  box-sizing: border-box;

  color: #333333;

  font-size: 15px;
  font-weight: 500;
  line-height: 1.65;

  resize: none;
  outline: none;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;

  &::placeholder {
    color: #9aa8a3;
    font-weight: 400;
  }

  &:focus {
    border-color: #00a97b;

    background: #fcfffe;

    box-shadow: 0 0 0 3px rgba(0, 169, 123, 0.1);
  }
`;

const TextCount = styled.p`
  margin: 8px 4px 0 0;

  color: ${({ $isLimit }) => ($isLimit ? "#00976f" : "#8a9b95")};

  font-size: 12px;
  font-weight: ${({ $isLimit }) => ($isLimit ? 800 : 600)};
  text-align: right;
`;
const Empty = styled.p`
  color: #777777;
`;