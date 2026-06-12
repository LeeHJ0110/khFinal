import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import eventImg from "../../assets/images/이벤트썸네일.png";
import PetStoreNavGate from "./PetStoreNavGate";

export default function PetStoreEventListPage() {
  const navigate = useNavigate();

  function handleMoveEventDetail() {
    navigate("/store/event/detail");
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

        <HeroCard>
          <HeroTextBox>
            <HeroBadge>WELCOME BENEFIT</HeroBadge>
            <HeroTitle>
              신규 회원을 위한
              <br />
              감사 포인트 이벤트
            </HeroTitle>
            <HeroDesc>
              PET&I FOR에 가입한 회원님께 2,000P를 즉시 지급해 드려요.
            </HeroDesc>
          </HeroTextBox>

          <HeroPointBox>
            <PointLabel>지급 혜택</PointLabel>
            <PointValue>2,000P</PointValue>
            <PointDesc>회원당 최초 1회</PointDesc>
          </HeroPointBox>
        </HeroCard>

        <ListCard>
          <ListTopRow>
            <ListTitleBox>
              <ListTitle>진행중인 이벤트</ListTitle>
              <ListCount>총 1건</ListCount>
            </ListTitleBox>

            <FilterChip>전체</FilterChip>
          </ListTopRow>

          <EventCard type="button" onClick={handleMoveEventDetail}>
            <ThumbnailBox>
              <EventThumbnail src={eventImg} alt="회원가입 감사 이벤트" />
              <StatusBadge>진행중</StatusBadge>
            </ThumbnailBox>

            <EventInfo>
              <EventCategory>WELCOME BENEFIT</EventCategory>
              <EventTitle>회원가입 감사 이벤트</EventTitle>
              <EventDesc>
                지금 가입하면 웰컴 포인트 2,000P를 즉시 지급해 드립니다.
              </EventDesc>

              <EventMetaList>
                <EventMetaItem>
                  <MetaLabel>혜택</MetaLabel>
                  <MetaValue>2,000P 지급</MetaValue>
                </EventMetaItem>

                <EventMetaItem>
                  <MetaLabel>대상</MetaLabel>
                  <MetaValue>신규 회원</MetaValue>
                </EventMetaItem>

                <EventMetaItem>
                  <MetaLabel>참여</MetaLabel>
                  <MetaValue>1인 1회</MetaValue>
                </EventMetaItem>
              </EventMetaList>
            </EventInfo>

            <ActionArea>
              <ActionText>자세히 보기</ActionText>
              <ActionArrow>›</ActionArrow>
            </ActionArea>
          </EventCard>
        </ListCard>

        <GuideCard>
          <GuideItem>
            <GuideIcon>🎁</GuideIcon>
            <GuideTextBox>
              <GuideTitle>이벤트 참여 안내</GuideTitle>
              <GuideDesc>
                이벤트 상세 페이지에서 2,000P 받기 버튼을 누르면 즉시
                지급됩니다.
              </GuideDesc>
            </GuideTextBox>
          </GuideItem>

          <GuideDivider />

          <GuideItem>
            <GuideIcon>🐾</GuideIcon>
            <GuideTextBox>
              <GuideTitle>회원당 1회 지급</GuideTitle>
              <GuideDesc>
                이미 지급받은 회원은 같은 이벤트 포인트를 다시 받을 수 없습니다.
              </GuideDesc>
            </GuideTextBox>
          </GuideItem>
        </GuideCard>
      </Wrapper>
    </Page>
  );
}

const floatUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 14px 28px rgba(0, 168, 126, 0.12);
  }

  50% {
    box-shadow: 0 18px 38px rgba(0, 168, 126, 0.22);
  }

  100% {
    box-shadow: 0 14px 28px rgba(0, 168, 126, 0.12);
  }
`;

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #f5faf3 0%, #ffffff 52%, #f5faf3 100%);
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

const HeroCard = styled.section`
  position: relative;
  min-height: 210px;
  padding: 34px 42px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border: 1px solid #d7dedb;
  border-radius: 16px;
  background:
    radial-gradient(
      circle at 86% 20%,
      rgba(0, 168, 126, 0.16),
      transparent 28%
    ),
    linear-gradient(135deg, #ffffff 0%, #f0fbf6 52%, #e4f8ef 100%);
  box-shadow: 0 16px 34px rgba(0, 80, 56, 0.08);

  overflow: hidden;
  box-sizing: border-box;
  animation: ${floatUp} 0.45s ease both;

  &::before {
    content: "";
    position: absolute;
    right: -70px;
    top: -80px;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background-color: rgba(0, 168, 126, 0.08);
  }

  &::after {
    content: "PET&I FOR";
    position: absolute;
    right: 42px;
    bottom: 24px;
    color: rgba(0, 168, 126, 0.08);
    font-size: 54px;
    font-weight: 900;
    letter-spacing: -1px;
  }
`;

const HeroTextBox = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroBadge = styled.span`
  height: 30px;
  padding: 0 14px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  background-color: #d9f3e9;
  color: #00a87e;

  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.5px;
`;

const HeroTitle = styled.h1`
  margin: 18px 0 0;
  color: #113d33;
  font-size: 36px;
  font-weight: 900;
  line-height: 1.22;
  letter-spacing: -1.3px;
`;

const HeroDesc = styled.p`
  margin: 14px 0 0;
  color: #666666;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
`;

const HeroPointBox = styled.div`
  position: relative;
  z-index: 1;

  width: 240px;
  height: 150px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(0, 168, 126, 0.28);
  border-radius: 18px;
  background-color: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(10px);

  animation: ${glow} 2.8s ease-in-out infinite;
`;

const PointLabel = styled.span`
  color: #777777;
  font-size: 13px;
  font-weight: 800;
`;

const PointValue = styled.strong`
  margin-top: 8px;
  color: #00a87e;
  font-size: 42px;
  font-weight: 950;
  line-height: 1;
  letter-spacing: -1px;
`;

const PointDesc = styled.span`
  margin-top: 10px;
  color: #999999;
  font-size: 12px;
  font-weight: 700;
`;

const ListCard = styled.section`
  margin-top: 20px;

  border: 1px solid #d7dedb;
  border-radius: 14px;
  background-color: #ffffff;
  box-shadow: 0 12px 28px rgba(0, 80, 56, 0.06);

  overflow: hidden;
  animation: ${floatUp} 0.55s ease both;
`;

const ListTopRow = styled.div`
  height: 62px;
  padding: 0 30px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #edf2f0;
  background-color: #ffffff;
`;

const ListTitleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ListTitle = styled.h3`
  margin: 0;
  color: #222222;
  font-size: 19px;
  font-weight: 850;
  letter-spacing: -0.4px;
`;

const ListCount = styled.span`
  color: #00a87e;
  font-size: 13px;
  font-weight: 800;
`;

const FilterChip = styled.span`
  height: 30px;
  padding: 0 16px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  background-color: #d9f3e9;
  color: #00a87e;

  font-size: 13px;
  font-weight: 800;
`;

const EventCard = styled.button`
  width: 100%;
  min-height: 250px;
  padding: 28px 30px;

  display: grid;
  grid-template-columns: 360px 1fr 150px;
  gap: 30px;
  align-items: center;

  border: 0;
  background-color: #ffffff;
  text-align: left;
  cursor: pointer;

  transition:
    transform 0.22s ease,
    background-color 0.22s ease,
    box-shadow 0.22s ease;

  &:hover {
    background-color: #fbfffd;
    transform: translateY(-3px);
    box-shadow: inset 4px 0 0 #00a87e;
  }

  &:hover img {
    transform: scale(1.045);
  }

  &:hover ${"" /* ActionArrow 아래 선언 전 참조 방지용 빈 보간 */} {
  }
`;

const ThumbnailBox = styled.div`
  position: relative;
  width: 360px;
  height: 190px;

  border-radius: 14px;
  overflow: hidden;
  background-color: #f5faf3;
  border: 1px solid #d7dedb;
`;

const EventThumbnail = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.35s ease;
`;

const StatusBadge = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;

  height: 28px;
  padding: 0 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  background-color: rgba(0, 168, 126, 0.92);
  color: #ffffff;

  font-size: 12px;
  font-weight: 850;
`;

const EventInfo = styled.div`
  min-width: 0;
`;

const EventCategory = styled.span`
  color: #00a87e;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.6px;
`;

const EventTitle = styled.h2`
  margin: 12px 0 0;
  color: #222222;
  font-size: 27px;
  font-weight: 900;
  letter-spacing: -0.8px;
`;

const EventDesc = styled.p`
  margin: 12px 0 0;
  color: #666666;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.55;
`;

const EventMetaList = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;

const EventMetaItem = styled.div`
  min-width: 118px;
  padding: 12px 14px;

  border: 1px solid #edf2f0;
  border-radius: 10px;
  background-color: #fbfffd;
`;

const MetaLabel = styled.div`
  color: #999999;
  font-size: 11px;
  font-weight: 800;
`;

const MetaValue = styled.div`
  margin-top: 5px;
  color: #333333;
  font-size: 13px;
  font-weight: 800;
`;

const ActionArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const ActionText = styled.span`
  color: #00a87e;
  font-size: 14px;
  font-weight: 850;
`;

const ActionArrow = styled.span`
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: #d9f3e9;
  color: #00a87e;

  font-size: 28px;
  font-weight: 500;
  line-height: 1;

  transition:
    transform 0.22s ease,
    background-color 0.22s ease;
`;

const GuideCard = styled.section`
  margin-top: 18px;
  padding: 24px 30px;

  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 28px;

  border: 1px solid #d7dedb;
  border-radius: 14px;
  background-color: #ffffff;
  box-shadow: 0 10px 24px rgba(0, 80, 56, 0.05);

  animation: ${floatUp} 0.65s ease both;
`;

const GuideItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const GuideIcon = styled.div`
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: #dff6ee;
  font-size: 22px;
`;

const GuideTextBox = styled.div``;

const GuideTitle = styled.h4`
  margin: 0;
  color: #222222;
  font-size: 15px;
  font-weight: 850;
`;

const GuideDesc = styled.p`
  margin: 6px 0 0;
  color: #777777;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
`;

const GuideDivider = styled.div`
  width: 1px;
  height: 100%;
  background-color: #edf2f0;
`;
