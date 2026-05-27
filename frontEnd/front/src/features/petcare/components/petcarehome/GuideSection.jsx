import styled from "styled-components";

function GuideSection() {
  return (
    <Wrapper>
      <DiseaseBox>
        <DiseaseItem>
          <Icon></Icon>
          <Name>주요증상</Name>
        </DiseaseItem>

        <DiseaseItem>
          <Icon>🦷</Icon>
          <Name>구강 질환</Name>
          <Desc>치석·입냄새·잇몸 상태 확인</Desc>
        </DiseaseItem>

        <DiseaseItem>
          <Icon>👁️</Icon>
          <Name>결막염</Name>
          <Desc>눈물·충혈·눈곱 유무 확인</Desc>
        </DiseaseItem>

        <DiseaseItem>
          <Icon>👁️</Icon>
          <Name>소화기/배설 질환</Name>
          <Desc>구토·설사·식욕 변화 확인</Desc>
        </DiseaseItem>

        <DiseaseItem>
          <Icon>👂</Icon>
          <Name>외이염</Name>
          <Desc>귀 냄새·가려움·분비물 확인</Desc>
        </DiseaseItem>

        <DiseaseItem>
          <Icon>🧴</Icon>
          <Name>피부병</Name>
          <Desc>피부 발적·탈모·각질 확인</Desc>
        </DiseaseItem>
      </DiseaseBox>

      <NoticeBox>
        <NoticeTitle>유의사항 및 반려 기준 안내</NoticeTitle>

        <NoticeList>
          <li>
            선명한 이미지 첨부: 피부, 눈, 치아 등 진단 부위가 흐리거나 어두운
            사진, 초점이 맞지 않은 이미지는 수의사 판단이 어려워 반려될 수
            있습니다.
          </li>
          <li>
            올바른 데이터 제출: 반려동물과 무관한 사진, 인물, 인터넷 캡처 사진
            또는 장난성/도배성 문항 작성 시 관리자의 판단에 따라 취소됩니다.
          </li>
          <li>
            반려 시 재신청: 조건에 맞지 않아 반려 처리된 경우, 입력된 데이터는
            초기화되며 올바른 자료를 다시 신청해 주셔야 합니다.
          </li>
          <li>이전 진단이 진행 중인 상태에서는 중복 신청이 불가능합니다.</li>
        </NoticeList>
      </NoticeBox>
    </Wrapper>
  );
}

export default GuideSection;

const Wrapper = styled.section`
  width: 100%;
`;

const DiseaseBox = styled.div`
  display: grid;
  grid-template-columns: 90px repeat(5, 1fr);

  overflow: hidden;

  border: 1px solid #d7e8df;
  border-radius: 6px;

  background: #fff;
`;

const DiseaseItem = styled.div`
  min-height: 122px;

  background: #fff;

  border-right: 1px solid #d7e8df;

  text-align: center;

  &:last-child {
    border-right: none;
  }
`;

const Icon = styled.div`
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #32b691;

  color: white;
  font-size: 28px;
`;

const Name = styled.div`
  padding-top: 10px;

  color: #00a97b;
  font-size: 14px;
  font-weight: 800;
`;

const Desc = styled.p`
  padding: 8px 8px 0;

  color: #333;
  font-size: 11px;
  line-height: 1.45;
`;

const NoticeBox = styled.div`
  margin-top: 16px;

  padding: 24px 30px;

  background: #dff3e8;

  border-radius: 6px;
`;

const NoticeTitle = styled.h3`
  margin-bottom: 16px;

  color: #00a97b;
  font-size: 20px;
  font-weight: 800;
`;

const NoticeList = styled.ul`
  padding-left: 18px;

  li {
    margin-bottom: 12px;

    color: #333;
    font-size: 13px;
    line-height: 1.6;
  }
`;
