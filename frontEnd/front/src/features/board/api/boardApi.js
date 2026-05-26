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
