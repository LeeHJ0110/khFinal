import { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import AdminLayout from "../components/AdminLayout";

import {
  getBlindBoardList,
  getBlindReplyList,
  cancelBoardBlind,
  cancelReplyBlind,
  getBoardReports,
  getReplyReports,
  deleteBoardReport,
  deleteReplyReport,
} from "../../../features/admin/api/adminCommunityBlindApi";

export default function AdminCommunityHistoryPage() {
  const [tab, setTab] = useState("BOARD");
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openId, setOpenId] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchList(page, tab);
  }, [page, tab]);

  async function fetchList(targetPage = 0, targetTab = tab) {
    try {
      const resp =
        targetTab === "BOARD"
          ? await getBlindBoardList(targetPage)
          : await getBlindReplyList(targetPage);

      setList(resp.data.content || []);
      setTotalPages(resp.data.totalPages || 0);
      setOpenId(null);
      setReports([]);
    } catch (err) {
      console.error(err);
      alert("목록 조회에 실패했습니다.");
    }
  }

  function changeTab(nextTab) {
    setTab(nextTab);
    setPage(0);
    setOpenId(null);
    setReports([]);
  }

  async function handleCancelBlind(id) {
    if (!window.confirm("블라인드를 해제하시겠습니까?")) return;

    try {
      if (tab === "BOARD") {
        await cancelBoardBlind(id);
      } else {
        await cancelReplyBlind(id);
      }

      alert("블라인드가 해제되었습니다.");
      fetchList(page, tab);
    } catch (err) {
      console.error(err);
      alert("블라인드 해제에 실패했습니다.");
    }
  }
  async function handleDeleteReport(reportId) {
    if (!reportId) {
      alert("신고이력 ID가 없습니다. 백엔드 응답을 확인해주세요.");
      return;
    }

    if (!window.confirm("신고이력을 삭제하시겠습니까?")) return;

    if (!window.confirm("신고이력을 삭제하시겠습니까?")) {
      return;
    }

    try {
      if (tab === "BOARD") {
        await deleteBoardReport(reportId);
      } else {
        await deleteReplyReport(reportId);
      }

      const resp =
        tab === "BOARD"
          ? await getBoardReports(boardId)
          : await getReplyReports(boardId);

      setReports(resp.data);

      alert("삭제되었습니다.");
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  }

  async function handleOpen(boardId) {
    if (openId === boardId) {
      setOpenId(null);
      setReports([]);
      return;
    }

    try {
      const resp =
        tab === "BOARD"
          ? await getBoardReports(openId)
          : await getReplyReports(openId);
      setReports(resp.data || []);
      setOpenId(boardId);
    } catch (err) {
      console.error(err);
      alert("신고 이력 조회에 실패했습니다.");
    }
  }

  return (
    <AdminLayout>
      <Container>
        <Header>
          <Title>커뮤니티 이력</Title>
        </Header>

        <TabArea>
          <TabButton
            $active={tab === "BOARD"}
            onClick={() => changeTab("BOARD")}
          >
            블라인드 게시글
          </TabButton>

          <TabButton
            $active={tab === "REPLY"}
            onClick={() => changeTab("REPLY")}
          >
            블라인드 댓글
          </TabButton>
        </TabArea>

        <ListBox>
          <Table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>내용</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>상세</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {list.length === 0 ? (
                <tr>
                  <EmptyTd colSpan={7}>
                    블라인드 처리된 항목이 없습니다.
                  </EmptyTd>
                </tr>
              ) : (
                list.map((item) => (
                  <Fragment key={item.id}>
                    <tr>
                      <td>{item.id}</td>
                      <TitleTd>{item.title}</TitleTd>
                      <ContentTd>{item.content}</ContentTd>
                      <td>{item.writerNickname}</td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>
                        <DetailButton onClick={() => handleOpen(item.id)}>
                          상세보기
                        </DetailButton>
                      </td>
                      <td>
                        <CancelButton
                          onClick={() => handleCancelBlind(item.id)}
                        >
                          블라인드 해제
                        </CancelButton>
                      </td>
                    </tr>

                    {openId === item.id && (
                      <tr>
                        <td colSpan={7}>
                          <ReportArea>
                            <ReportTitle>신고 이력</ReportTitle>

                            {reports.length === 0 ? (
                              <EmptyReport>신고 이력이 없습니다.</EmptyReport>
                            ) : (
                              reports.map((report) => (
                                <ReportCard key={report.reportId}>
                                  <Reporter>
                                    신고자 : {report.reporterNickname}
                                  </Reporter>

                                  <Reason>사유 : {report.reason}</Reason>

                                  <DeleteReportButton
                                    disabled={!report.reportId}
                                    onClick={() =>
                                      handleDeleteReport(report.reportId)
                                    }
                                  >
                                    신고이력 삭제
                                  </DeleteReportButton>
                                </ReportCard>
                              ))
                            )}
                          </ReportArea>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </Table>
        </ListBox>

        <Pagination>
          <PageButton disabled={page === 0} onClick={() => setPage(page - 1)}>
            이전
          </PageButton>

          <PageText>
            {page + 1} / {totalPages || 1}
          </PageText>

          <PageButton
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            다음
          </PageButton>
        </Pagination>
      </Container>
    </AdminLayout>
  );
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

const Container = styled.div`
  padding: 32px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
`;

const TabArea = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
`;

const TabButton = styled.button`
  padding: 10px 18px;
  border: 1px solid ${({ $active }) => ($active ? "#00a37a" : "#ddd")};
  border-radius: 999px;
  background-color: ${({ $active }) => ($active ? "#d9f5ec" : "white")};
  color: ${({ $active }) => ($active ? "#007a5c" : "#333")};
  font-weight: ${({ $active }) => ($active ? 800 : 500)};
  cursor: pointer;
`;

const ListBox = styled.div`
  border: 1px solid #eee;
  border-radius: 14px;
  overflow: hidden;
  background-color: white;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    height: 46px;
    background-color: #fafafa;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }

  td {
    height: 56px;
    padding: 10px 12px;
    border-bottom: 1px solid #f1f1f1;
    text-align: center;
    font-size: 14px;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const TitleTd = styled.td`
  max-width: 180px;
  font-weight: 700;
`;

const ContentTd = styled.td`
  max-width: 320px;
  text-align: left !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyTd = styled.td`
  height: 120px !important;
  color: #999;
  font-weight: 700;
`;

const DetailButton = styled.button`
  height: 34px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;
  background: #111;
  color: white;
  cursor: pointer;
`;

const CancelButton = styled.button`
  height: 34px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;
  background-color: #ff5252;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

const ReportArea = styled.div`
  padding: 20px;
  background: #fafafa;
  text-align: left;
`;

const ReportTitle = styled.h3`
  margin-bottom: 16px;
`;

const ReportCard = styled.div`
  padding: 14px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;
`;

const Reporter = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
`;

const Reason = styled.div`
  color: #555;
`;

const EmptyReport = styled.div`
  padding: 20px;
  color: #999;
  font-weight: 700;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
`;

const PageButton = styled.button`
  height: 36px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;

  &:disabled {
    color: #aaa;
    cursor: not-allowed;
  }
`;

const PageText = styled.span`
  font-weight: 700;
`;
const DeleteReportButton = styled.button`
  margin-top: 12px;
  height: 34px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;
  background-color: #111;
  color: white;
  cursor: pointer;
`;
