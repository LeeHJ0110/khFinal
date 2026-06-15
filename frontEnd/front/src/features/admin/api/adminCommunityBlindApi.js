import api from "../../../app/api/axios";

export function getBlindBoardList(page = 0, size = 10) {
  return api.get("/admin/community/blind/boards", {
    params: {
      page,
      size,
    },
  });
}

export function getBlindReplyList(page = 0, size = 10) {
  return api.get("/admin/community/blind/replies", {
    params: {
      page,
      size,
    },
  });
}

export function cancelBoardBlind(boardId) {
  return api.put(`/admin/community/blind/boards/${boardId}/cancel`);
}

export function cancelReplyBlind(replyId) {
  return api.put(`/admin/community/blind/replies/${replyId}/cancel`);
}

export function getBoardReports(boardId) {
  return api.get(`/admin/community/blind/boards/${boardId}/reports`);
}

export function deleteBoardReport(reportId) {
  return api.delete(`/admin/community/blind/reports/${reportId}`);
}

export function getReplyReports(replyId) {
  return api.get(`/admin/community/blind/replies/${replyId}/reports`);
}

export function deleteReplyReport(reportId) {
  return api.delete(`/admin/community/blind/reply-reports/${reportId}`);
}
