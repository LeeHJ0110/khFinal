import styled from "styled-components";

function CheckSection() {
  return (
    <Wrapper>
      <Title>진단 항목</Title>

      <Grid>
        <Item>
          <Icon>🔍</Icon>
          <TextBox>
            <ItemTitle>이미지 검사</ItemTitle>
            <ItemDesc>사진으로 피부·눈·치아 등 건강 상태를 확인하세요</ItemDesc>
          </TextBox>
        </Item>

        <Item>
          <Icon>🧘</Icon>
          <TextBox>
            <ItemTitle>스트레스 검사</ItemTitle>
            <ItemDesc>반려동물의 심리 상태 검사</ItemDesc>
          </TextBox>
        </Item>

        <Item>
          <Icon>🦠</Icon>
          <TextBox>
            <ItemTitle>질병 이력 검사</ItemTitle>
            <ItemDesc>과거의 질병이력을 확인합니다.</ItemDesc>
          </TextBox>
        </Item>

        <Item>
          <Icon>🐾</Icon>
          <TextBox>
            <ItemTitle>생활 습관 확인</ItemTitle>
            <ItemDesc>식습관, 활동량, 수면량 등으로 검사</ItemDesc>
          </TextBox>
        </Item>

        <Item>
          <Icon>💉</Icon>
          <TextBox>
            <ItemTitle>예방접종 내역</ItemTitle>
            <ItemDesc>예방접종 확인 절차</ItemDesc>
          </TextBox>
        </Item>

        <Item>
          <Icon>📋</Icon>
          <TextBox>
            <ItemTitle>상담 내용 작성</ItemTitle>
            <ItemDesc>보호자님이 원하는 주요 문의와 이상 행동 작성</ItemDesc>
          </TextBox>
        </Item>
      </Grid>
    </Wrapper>
  );
}

export default CheckSection;

const Wrapper = styled.section`
  width: 100%;
`;

const Title = styled.h2`
  font-size: 34px;
  font-weight: 800;
  color: #00a97b;
  margin-bottom: 32px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px 34px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Icon = styled.div`
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #dff4eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const TextBox = styled.div`
  min-width: 0;
`;

const ItemTitle = styled.h3`
  color: #00a97b;
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 6px;
`;

const ItemDesc = styled.p`
  font-size: 12px;
  color: #333;
  line-height: 1.45;
`;
