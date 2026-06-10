import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import AdminLayout from "../components/AdminLayout";
import useAdminMessage from "../../../features/admin/hooks/useAdminMessage";

export default function AdminSentMessagePage() {
  const { sentMessages, fetchSentMessages } = useAdminMessage();
  const [openKey, setOpenKey] = useState(null);

  useEffect(() => {
    fetchSentMessages();
  }, []);

  const groupedMessages = useMemo(() => {
    const map = new Map();

    sentMessages.forEach((message) => {
      const key = [
        message.reasonType,
        message.title,
        message.content,
        formatDate(message.createdAt),
      ].join("|");

      if (!map.has(key)) {
        map.set(key, {
          key,
          reasonType: message.reasonType,
          title: message.title,
          content: message.content,
          createdAt: message.createdAt,
          receivers: [],
          readReceivers: [],
          unreadReceivers: [],
          readCount: 0,
          unreadCount: 0,
        });
      }

      const group = map.get(key);
      const receiverNickname = message.receiverNickname || "-";

      group.receivers.push(receiverNickname);

      if (message.readYn === "Y") {
        group.readCount += 1;
        group.readReceivers.push(receiverNickname);
      } else {
        group.unreadCount += 1;
        group.unreadReceivers.push(receiverNickname);
      }
    });

    return Array.from(map.values());
  }, [sentMessages]);

  function toggleOpen(key) {
    setOpenKey((prev) => (prev === key ? null : key));
  }

  return (
    <AdminLayout>
      <Container>
        <Title>보낸쪽지함</Title>

        <Table>
          <thead>
            <tr>
              <th>받는 사람</th>
              <th>분류</th>
              <TitleTh>제목</TitleTh>
              <th>읽음 상태</th>
              <th>발송일</th>
            </tr>
          </thead>

          <tbody>
            {groupedMessages.map((message) => (
              <>
                <tr key={message.key}>
                  <td>{getReceiverText(message.receivers)}</td>
                  <td>{getReasonText(message.reasonType)}</td>
                  <TitleTd onClick={() => toggleOpen(message.key)}>
                    {message.title}
                  </TitleTd>
                  <td>
                    읽음 {message.readCount}명 / 안읽음 {message.unreadCount}명
                  </td>
                  <td>{formatDate(message.createdAt)}</td>
                </tr>

                {openKey === message.key && (
                  <tr>
                    <ContentTd colSpan={5}>
                      <ContentBox>
                        <ReceiverList>
                          받는 사람: {message.receivers.join(", ")}
                        </ReceiverList>
                        <UnreadList>
                          안읽은 회원:{" "}
                          {message.unreadReceivers.length > 0
                            ? message.unreadReceivers.join(", ")
                            : "없음"}
                        </UnreadList>

                        <MessageContent>{message.content}</MessageContent>
                      </ContentBox>
                    </ContentTd>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </Table>
      </Container>
    </AdminLayout>
  );
}

function getReceiverText(receivers) {
  if (receivers.length === 0) return "-";
  if (receivers.length === 1) return receivers[0];

  return `${receivers[0]} 외 ${receivers.length - 1}명`;
}

function getReasonText(reasonType) {
  switch (reasonType) {
    case "NOTICE":
      return "공지";
    case "SCHEDULE":
      return "일정";
    case "INSURANCE":
      return "보험";
    case "COMMUNITY":
      return "커뮤니티";
    case "AD":
      return "광고";
    default:
      return reasonType || "-";
  }
}

function formatDate(value) {
  if (!value) return "-";
  return value.replace("T", " ").substring(0, 16);
}

const Container = styled.div`
  padding: 32px;
`;

const Title = styled.h1`
  margin-bottom: 24px;
  font-size: 28px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;

  th,
  td {
    padding: 14px;
    border-bottom: 1px solid #eee;
    text-align: left;
    font-size: 14px;
  }

  th {
    background-color: #f8f8f8;
    font-weight: 700;
  }
`;

const TitleTh = styled.th`
  width: 34%;
`;

const TitleTd = styled.td`
  font-weight: 700;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ContentTd = styled.td`
  background-color: #fafafa;
`;

const ContentBox = styled.div`
  padding: 18px;
  border-radius: 12px;
  background-color: white;
  border: 1px solid #eee;
`;

const ReceiverList = styled.div`
  margin-bottom: 14px;
  color: #666;
  font-size: 13px;
`;

const MessageContent = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
`;
const UnreadList = styled.div`
  margin-bottom: 14px;
  color: #d93636;
  font-size: 13px;
  font-weight: 700;
`;
