import api from "../../../app/api/axios";

export function sendAdminMessage(data) {
  return api.post("/admin/message", data);
}

export function getAdminSentMessages() {
  return api.get("/admin/message/sent");
}

export function bulkSendMessage(data) {
  return api.post("/admin/message/bulk", data);
}
