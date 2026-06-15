import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import eventImg from "../../assets/images/이벤트이미지.png";

import usePointEffect from "../../features/point/hooks/usePointEffect";
import PetStoreNavGate from "./PetStoreNavGate";

export default function PetStoreEventDetailPage() {
  const navigate = useNavigate();
  const { runEventJoinPoint } = usePointEffect();

  async function handleEventPointClick() {
    try {
      await runEventJoinPoint();
    } catch (error) {
      console.error("회원가입 감사 이벤트 포인트 지급 실패:", error);
    }
  }

  function handleGoEventList() {
    navigate("/store/event/list");
  }

  function handleBlockedEventMove() {
    alert("현재 진행 중인 다른 이벤트가 없습니다.");
  }

  return (
    <Page>
      <PetStoreNavGate />

      <Wrapper>
        <HeaderArea>
          <TitleRow>
            <PageTitle>이벤트</PageTitle>
            <PageDesc>회원님을 위한 PET&I FOR 스토어 혜택</PageDesc>
          </TitleRow>
        </HeaderArea>

        <DetailCard>
          <EventMetaRow>
            <EventBadge>진행중</EventBadge>
            <EventCategory>WELCOME BENEFIT</EventCategory>
          </EventMetaRow>

          <EventTitle>회원가입 감사 이벤트</EventTitle>

          <EventSubInfo>
            <span>신규 회원 대상</span>
            <Divider />
            <span>즉시 지급</span>
            <Divider />
            <span>1인 1회 참여 가능</span>
          </EventSubInfo>

          <NoticeBox>
            <NoticeIcon>🎁</NoticeIcon>
            <NoticeText>
              아래 이벤트 이미지의 <strong>2000P 받기</strong> 버튼을 클릭하면
              회원가입 감사 포인트가 지급됩니다.
            </NoticeText>
          </NoticeBox>

          <EventImageBox>
            <EventImage src={eventImg} alt="회원가입 감사 이벤트" />

            <EventPointButton
              type="button"
              aria-label="회원가입 감사 이벤트 2000포인트 받기"
              onClick={handleEventPointClick}
            />
          </EventImageBox>

          <InfoSection>
            <InfoTitle>이벤트 안내</InfoTitle>

            <InfoGrid>
              <InfoItem>
                <InfoLabel>혜택</InfoLabel>
                <InfoValue>회원가입 감사 포인트 2,000P 지급</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>대상</InfoLabel>
                <InfoValue>PET&I FOR 신규 회원</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>참여 방법</InfoLabel>
                <InfoValue>이벤트 이미지 내 2000P 받기 버튼 클릭</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>유의사항</InfoLabel>
                <InfoValue>회원당 최초 1회만 지급됩니다.</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          <BottomNavSection>
            <EventMoveRow>
              <MoveLabel>이전글</MoveLabel>
              <MoveButton type="button" onClick={handleBlockedEventMove}>
                종료된 이벤트가 없습니다.
              </MoveButton>
            </EventMoveRow>

            <EventMoveRow>
              <MoveLabel>다음글</MoveLabel>
              <MoveButton type="button" onClick={handleBlockedEventMove}>
                다음 이벤트는 준비 중입니다.
              </MoveButton>
            </EventMoveRow>
          </BottomNavSection>

          <ButtonRow>
            <ListButton type="button" onClick={handleGoEventList}>
              목록으로
            </ListButton>
          </ButtonRow>
        </DetailCard>
      </Wrapper>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5faf3;
`;

const Wrapper = styled.main`
  width: 1300px;
  margin: 0 auto;
  padding: 30px 0 80px;
  box-sizing: border-box;
`;

const HeaderArea = styled.section`
  margin-bottom: 18px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 18px;
`;

const PageTitle = styled.h2`
  margin: 0;
  color: #222222;
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.8px;
`;

const PageDesc = styled.p`
  margin: 0 0 3px;
  color: #777777;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
`;

const DetailCard = styled.article`
  width: 100%;
  padding: 34px 44px 38px;

  border: 1px solid #d7dedb;
  border-radius: 14px;
  background-color: #ffffff;
  box-shadow: 0 16px 34px rgba(0, 80, 56, 0.08);

  box-sizing: border-box;
`;

const EventMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

const EventBadge = styled.span`
  height: 28px;
  padding: 0 13px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  background-color: #d9f3e9;
  color: #00a87e;

  font-size: 13px;
  font-weight: 800;
`;

const EventCategory = styled.span`
  color: #999999;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.6px;
`;

const EventTitle = styled.h1`
  margin: 0;
  color: #222222;
  font-size: 34px;
  font-weight: 850;
  letter-spacing: -1.2px;
`;

const EventSubInfo = styled.div`
  margin-top: 14px;
  padding-bottom: 24px;

  display: flex;
  align-items: center;
  gap: 12px;

  border-bottom: 1px solid #edf2f0;

  color: #777777;
  font-size: 14px;
  font-weight: 600;
`;

const Divider = styled.i`
  width: 1px;
  height: 12px;
  background-color: #d7dedb;
`;

const NoticeBox = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
  padding: 16px 20px;

  display: flex;
  align-items: center;
  gap: 12px;

  border: 1px solid #d7dedb;
  border-radius: 10px;
  background-color: #fbfffd;
`;

const NoticeIcon = styled.span`
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: #dff6ee;
  font-size: 18px;
`;

const NoticeText = styled.p`
  margin: 0;
  color: #444444;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;

  strong {
    color: #00a87e;
    font-weight: 850;
  }
`;

const EventImageBox = styled.div`
  position: relative;
  width: 100%;

  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #d7dedb;
  background-color: #f5faf3;
  line-height: 0;
`;

const EventImage = styled.img`
  width: 100%;
  display: block;
`;

const EventPointButton = styled.button`
  position: absolute;

  left: 28.5%;
  top: 73.5%;
  width: 43%;
  height: 6.8%;

  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;

  &:hover {
    cursor: pointer;
  }

  &:focus-visible {
    outline: 3px solid rgba(0, 168, 126, 0.45);
    border-radius: 999px;
  }
`;

const InfoSection = styled.section`
  margin-top: 28px;
`;

const InfoTitle = styled.h3`
  margin: 0 0 14px;
  color: #222222;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.4px;
`;

const InfoGrid = styled.div`
  border: 1px solid #d7dedb;
  border-radius: 10px;
  overflow: hidden;
`;

const InfoItem = styled.div`
  min-height: 52px;
  display: grid;
  grid-template-columns: 170px 1fr;

  border-bottom: 1px solid #edf2f0;

  &:last-child {
    border-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  padding: 0 22px;

  display: flex;
  align-items: center;

  background-color: #dff6ee;
  color: #00a87e;

  font-size: 14px;
  font-weight: 800;
`;

const InfoValue = styled.div`
  padding: 0 22px;

  display: flex;
  align-items: center;

  color: #333333;
  font-size: 14px;
  font-weight: 600;
`;

const BottomNavSection = styled.section`
  margin-top: 30px;
  border-top: 1px solid #edf2f0;
  border-bottom: 1px solid #edf2f0;
`;

const EventMoveRow = styled.div`
  height: 52px;

  display: grid;
  grid-template-columns: 110px 1fr;
  align-items: center;

  border-bottom: 1px solid #edf2f0;

  &:last-child {
    border-bottom: 0;
  }
`;

const MoveLabel = styled.div`
  color: #999999;
  font-size: 13px;
  font-weight: 800;
`;

const MoveButton = styled.button`
  width: fit-content;

  border: 0;
  background-color: transparent;
  color: #555555;

  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: #00a87e;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const ButtonRow = styled.div`
  margin-top: 28px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const ListButton = styled.button`
  width: 130px;
  height: 42px;

  border: 1px solid #d7dedb;
  border-radius: 6px;
  background-color: #ffffff;
  color: #777777;

  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: #f7faf9;
    color: #222222;
  }
`;

const PointButton = styled.button`
  width: 170px;
  height: 42px;

  border: 0;
  border-radius: 6px;
  background-color: #00a87e;
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(0, 168, 126, 0.24);

  font-size: 15px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background-color: #00946f;
  }
`;

const FakeEventCard = styled.section`
  margin-top: 18px;
  padding: 22px 28px;

  border: 1px solid #d7dedb;
  border-radius: 12px;
  background-color: #ffffff;

  display: grid;
  grid-template-columns: 130px 1fr;
  column-gap: 20px;
  row-gap: 6px;
  align-items: center;
`;

const FakeEventLabel = styled.span`
  grid-row: span 2;
  width: 116px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  background-color: #eeeeee;
  color: #888888;

  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.4px;
`;

const FakeEventTitle = styled.h3`
  margin: 0;
  color: #222222;
  font-size: 17px;
  font-weight: 800;
`;

const FakeEventDesc = styled.p`
  margin: 0;
  color: #777777;
  font-size: 13px;
  font-weight: 600;
`;
