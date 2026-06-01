import styled from "styled-components";

export default function PetStoreRecentAside() {
  return (
    <Wrapper>
      <RecentHeader>
        <RecentTitle>최근 본 상품</RecentTitle>
        <RecentCount>3/3</RecentCount>
      </RecentHeader>

      <RecentList>
        <RecentItem>
          <RecentThumb>이미지</RecentThumb>
          <RecentName>강아지 가수분해 덴탈껌</RecentName>
        </RecentItem>

        <RecentItem>
          <RecentThumb>이미지</RecentThumb>
          <RecentName>탐사 실속형 배변패드</RecentName>
        </RecentItem>

        <RecentItem>
          <RecentThumb>이미지</RecentThumb>
          <RecentName>강아지 브레스 기관지 영양제 100g</RecentName>
        </RecentItem>
      </RecentList>
    </Wrapper>
  );
}

const Wrapper = styled.aside`
  position: sticky;
  top: 96px;

  height: 375px;
  padding: 18px 16px;

  border-radius: 4px;
  background-color: #edf5f1;
`;

const RecentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RecentTitle = styled.h3`
  margin: 0;

  color: var(--text-main);
  font-size: 13px;
  font-weight: 900;
`;

const RecentCount = styled.span`
  color: var(--text-sub);
  font-size: 11px;
  font-weight: 700;
`;

const RecentList = styled.div`
  margin-top: 18px;

  display: flex;
  flex-direction: column;
`;

const RecentItem = styled.div`
  min-height: 88px;
  padding: 14px 0;

  display: flex;
  align-items: center;
  gap: 10px;

  border-bottom: 1px solid #d5e2dc;

  &:last-child {
    border-bottom: 0;
  }
`;

const RecentThumb = styled.div`
  width: 52px;
  height: 52px;
  flex: 0 0 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;
  background-color: var(--color-white);
  color: var(--text-desc);

  font-size: 10px;
  font-weight: 800;
`;

const RecentName = styled.p`
  min-width: 0;
  margin: 0;

  color: var(--text-main);
  font-size: 11px;
  font-weight: 800;
  line-height: 1.35;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
