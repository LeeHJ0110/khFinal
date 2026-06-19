import { useEffect, useState } from "react";
import { deleteMessage, getMyMessages, readMessage } from "../api/messageApi";

export default function useMessage() {
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchMyMessages() {
    try {
      setLoading(true);
      setError("");

      const response = await getMyMessages();

      const data = Array.isArray(response.data) ? response.data : [];

      setMessageList(data);

      return data;
    } catch (err) {
      console.error(err);
      setError("쪽지 목록을 불러오지 못했습니다.");
      setMessageList([]);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function handleReadMessage(messageId) {
    try {
      await readMessage(messageId);

      setMessageList((prev) =>
        prev.map((message) =>
          message.id === messageId ? { ...message, readYn: "Y" } : message,
        ),
      );

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async function handleDeleteMessage(messageId) {
    try {
      await deleteMessage(messageId);
      await fetchMyMessages();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  useEffect(() => {
    fetchMyMessages();
  }, []);

  return {
    messageList,
    loading,
    error,
    fetchMyMessages,
    handleReadMessage,
    handleDeleteMessage,
  };
}
