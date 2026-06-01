import api from "../../../../app/api/axios";

// 내 쪽지 목록 조회
export function getMyMessages() {
  return api.get("/message");
}

// 쪽지 읽음 처리
export function readMessage(messageId) {
  return api.put(`/message/${messageId}/read`);
}

// 쪽지 삭제
export function deleteMessage(messageId) {
  return api.delete(`/message/${messageId}`);
}

export function getUnreadMessageCount() {
  return api.get("/message/unread-count");
}
