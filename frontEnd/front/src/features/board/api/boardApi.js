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
      boardSubCategory: searchCondition.boardSubCategory || null,
    },
  });
}
