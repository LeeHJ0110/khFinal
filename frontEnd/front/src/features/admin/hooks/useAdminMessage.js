import { useState } from "react";
import {
  sendAdminMessage,
  getAdminSentMessages,
  bulkSendMessage,
} from "../api/adminMessageApi";

export default function useAdminMessage() {
  const [sentMessages, setSentMessages] = useState([]);

  async function handleSendMessage(data, options = {}) {
    const { showAlert = true } = options;

    try {
      await sendAdminMessage(data);

      if (showAlert) {
        alert("쪽지가 발송되었습니다.");
      }

      return true;
    } catch (err) {
      console.error(err);
      alert("쪽지 발송 실패");
      return false;
    }
  }

  async function fetchSentMessages() {
    try {
      const resp = await getAdminSentMessages();

      setSentMessages(resp.data);
    } catch (err) {
      console.error(err);
      alert("보낸쪽지함 조회 실패");
    }
  }
  async function handleBulkSendMessage(data) {
    try {
      await bulkSendMessage(data);

      alert("쪽지가 발송되었습니다.");
      return true;
    } catch (err) {
      console.error(err);
      alert("쪽지 발송 실패");
      return false;
    }
  }

  return {
    sentMessages,
    handleSendMessage,
    fetchSentMessages,
    handleBulkSendMessage,
  };
}
