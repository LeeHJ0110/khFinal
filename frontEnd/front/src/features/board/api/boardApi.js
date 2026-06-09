import api from "../../../app/api/axios";

export async function writeBoardApi(formData) {
  return await api.post("/board/new", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function updateBoardApi(boardId, formData) {
  return await api.put(`/board/edit/${boardId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function fetchBoardList(category, page = 0, searchCondition = {}) {
  return await api.get(`/board/${category}`, {
    params: {
      page: page,
      title: searchCondition.title || null,
      content: searchCondition.content || null,
      writer: searchCondition.writer || null,
      boardSubCategory: searchCondition.boardSubCategory || null,
      sort: searchCondition.sort || null,
    },
  });
}

export const fetchBoardDetail = async (boardId) => {
  const response = await api.get(`/board/detail/${boardId}`);
  return response.data;
};

export const deleteBoardApi = async (boardId) => {
  const resp = await api.delete(`/board`, {
    params: { id: boardId },
  });
  return resp.data;
};

export async function writeReplyApi(boardId, content, parentId = null) {
  return await api.post(`/board/${boardId}/reply`, {
    content,
    parentId,
  });
}

export async function deleteReplyApi(replyId) {
  return await api.delete(`/board/reply/${replyId}`);
}

export async function toggleLikeApi(boardId) {
  return await api.post(`/board/${boardId}/like`);
}

export async function fetchNaverNewsApi(page = 0, search = "반려동물") {
  return await api.get("/board/news", {
    params: { page, search },
  });
}

export async function reportBoardApi(boardId, reason) {
  return await api.post(`/board/${boardId}/report`, { reason });
}
