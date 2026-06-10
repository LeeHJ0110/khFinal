import styled from "styled-components";
import MyPageLayout from "./components/MyPageLayout";
import usePointHistory from "../../features/mypage/point/hooks/usePointHistory";

const missions = [
  {
    key: "attendanceCompleted",
    title: "일간 출석",
    point: "100P",
    desc: "하루 1회",
  },
  {
    key: "trainingDiaryCompleted",
    title: "훈련일기",
    point: "500P",
    desc: "주간 1회",
  },
  {
    key: "communityPostCompleted",
    title: "게시글 작성",
    point: "500P",
    desc: "주간 1회",
  },
];

export default function PointHistoryPage() {
  const {
    summary,
    historyList,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
  } = usePointHistory();

  return (
    <MyPageLayout>
      <Title>포인트 내역</Title>

      {loading ? (
        <EmptyBox>포인트 정보를 불러오는 중입니다...</EmptyBox>
      ) : (
        <>
          <PointCard>
            <CardLabel>보유 포인트</CardLabel>
            <PointValue>
              {summary?.currentPoint?.toLocaleString() || 0}P
            </PointValue>
          </PointCard>

          <MissionGrid>
            {missions.map((mission) => {
              const completed = summary?.[mission.key];

              return (
                <MissionCard key={mission.key} $completed={completed}>
                  <MissionTop>
                    <MissionTitle>{mission.title}</MissionTitle>
                    <MissionBadge $completed={completed}>
                      {completed ? "완료" : "미완료"}
                    </MissionBadge>
                  </MissionTop>

                  <MissionPoint>{mission.point}</MissionPoint>
                  <MissionDesc>{mission.desc}</MissionDesc>
                </MissionCard>
              );
            })}

            <MissionCard>
              <MissionTop>
                <MissionTitle>상품 리뷰</MissionTitle>
                <MissionBadge>누적</MissionBadge>
              </MissionTop>
              <MissionPoint>{summary?.reviewWriteCount || 0}건</MissionPoint>
              <MissionDesc>구매건당 적립</MissionDesc>
            </MissionCard>

            <MissionCard>
              <MissionTop>
                <MissionTitle>이벤트 참여</MissionTitle>
                <MissionBadge>누적</MissionBadge>
              </MissionTop>
              <MissionPoint>{summary?.eventJoinCount || 0}회</MissionPoint>
              <MissionDesc>이벤트별 지급</MissionDesc>
            </MissionCard>
          </MissionGrid>

          <HistorySection>
            <SectionTitle>포인트 적립/사용 내역</SectionTitle>

            {historyList.length === 0 ? (
              <EmptyHistory>포인트 내역이 없습니다.</EmptyHistory>
            ) : (
              <HistoryList>
                {historyList.map((history) => (
                  <HistoryItem key={history.pointHistoryId}>
                    <HistoryLeft>
                      <HistoryName>{history.reasonName}</HistoryName>
                      <HistoryMemo>{history.memo || "포인트 내역"}</HistoryMemo>
                      <HistoryDate>{history.createdAt}</HistoryDate>
                    </HistoryLeft>

                    <HistoryRight>
                      <PointAmount $plus={history.pointAmount > 0}>
                        {history.pointAmount > 0 ? "+" : ""}
                        {history.pointAmount?.toLocaleString()}P
                      </PointAmount>
                      <Balance>
                        잔액 {history.pointBalanceAfter?.toLocaleString()}P
                      </Balance>
                    </HistoryRight>
                  </HistoryItem>
                ))}
              </HistoryList>
            )}
          </HistorySection>

          {totalPages > 1 && (
            <Pagination>
              <PageBtn
                type="button"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                {"<"}
              </PageBtn>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <PageBtn
                  key={idx}
                  type="button"
                  $active={currentPage === idx}
                  onClick={() => setCurrentPage(idx)}
                >
                  {idx + 1}
                </PageBtn>
              ))}

              <PageBtn
                type="button"
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                {">"}
              </PageBtn>
            </Pagination>
          )}
        </>
      )}
    </MyPageLayout>
  );
}

const Title = styled.h1`
  font-size: 32px;
  color: #00a982;
  margin-bottom: 24px;
`;

const EmptyBox = styled.div`
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-weight: 700;
`;

const PointCard = styled.section`
  width: 100%;
  max-width: 900px;
  padding: 30px;
  border-radius: 16px;
  background: #00b894;
  color: white;
  margin-bottom: 22px;
`;

const CardLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const PointValue = styled.div`
  margin-top: 10px;
  font-size: 42px;
  font-weight: 900;
`;

const MissionGrid = styled.div`
  width: 100%;
  max-width: 900px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

const MissionCard = styled.div`
  background: ${({ $completed }) => ($completed ? "#e9fbf4" : "white")};
  border: 1px solid ${({ $completed }) => ($completed ? "#00b894" : "#e9ecef")};
  border-radius: 14px;
  padding: 16px;
`;

const MissionTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MissionTitle = styled.div`
  font-size: 14px;
  font-weight: 800;
`;

const MissionBadge = styled.span`
  font-size: 11px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 999px;
  color: ${({ $completed }) => ($completed ? "#00a982" : "#777")};
  background: ${({ $completed }) => ($completed ? "#d9f6ec" : "#f1f3f5")};
`;

const MissionPoint = styled.div`
  margin-top: 18px;
  font-size: 22px;
  font-weight: 900;
  color: #00a982;
`;

const MissionDesc = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #777;
`;

const HistorySection = styled.section`
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 16px;
  padding: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 18px;
`;

const EmptyHistory = styled.div`
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-weight: 700;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
`;

const HistoryItem = styled.div`
  padding: 18px 0;
  border-bottom: 1px solid #f1f3f4;
  display: flex;
  justify-content: space-between;

  &:last-child {
    border-bottom: none;
  }
`;

const HistoryName = styled.div`
  font-size: 16px;
  font-weight: 800;
`;

const HistoryMemo = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #777;
`;

const HistoryDate = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #999;
`;

const HistoryLeft = styled.div``;

const HistoryRight = styled.div`
  text-align: right;
`;

const PointAmount = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: ${({ $plus }) => ($plus ? "#00a982" : "#fa5252")};
`;

const Balance = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #999;
`;

const Pagination = styled.div`
  width: 100%;
  max-width: 900px;
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const PageBtn = styled.button`
  width: 34px;
  height: 34px;
  border: 1px solid ${({ $active }) => ($active ? "#00a982" : "#dee2e6")};
  border-radius: 6px;
  background: ${({ $active }) => ($active ? "#00a982" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#555")};
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
