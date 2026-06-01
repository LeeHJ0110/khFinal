import { useState } from "react";
import styled from "styled-components";
import MyPageLayout from "./components/MyPageLayout";
import useMessage from "../../features/mypage/message/hooks/useMessage";

const tabs = [
  { label: "전체", value: "ALL" },
  { label: "공지", value: "NOTICE" },
  { label: "일정", value: "SCHEDULE" },
  { label: "보험", value: "INSURANCE" },
  { label: "커뮤니티", value: "COMMUNITY" },
  { label: "광고", value: "AD" },
];

const reasonLabel = {
  NOTICE: "공지",
  SCHEDULE: "일정",
  INSURANCE: "보험",
  COMMUNITY: "커뮤니티",
  AD: "광고",
};

export default function MessageBoxPage() {
  const { messageList, loading, handleReadMessage, handleDeleteMessage } =
    useMessage();

  const [activeTab, setActiveTab] = useState("ALL");
  const [openedId, setOpenedId] = useState(null);

  const filteredList =
    activeTab === "ALL"
      ? messageList
      : messageList.filter((message) => message.reasonType === activeTab);

  async function handleToggle(message) {
    setOpenedId((prev) => (prev === message.id ? null : message.id));

    if (message.readYn === "N") {
      await handleReadMessage(message.id);
    }
  }

  async function handleDelete(evt, messageId) {
    evt.stopPropagation();

    const result = confirm("쪽지를 삭제하시겠습니까?");
    if (!result) return;

    await handleDeleteMessage(messageId);

    if (openedId === messageId) {
      setOpenedId(null);
    }
  }

  return (
    <MyPageLayout>
      <Title>쪽지함</Title>

      <TabList>
        {tabs.map((tab) => (
          <TabButton
            key={tab.value}
            type="button"
            $active={activeTab === tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setOpenedId(null);
            }}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabList>

      <MessageCard>
        {loading ? (
          <EmptyBox>쪽지를 불러오는 중입니다...</EmptyBox>
        ) : filteredList.length === 0 ? (
          <EmptyBox>쪽지가 없습니다.</EmptyBox>
        ) : (
          filteredList.map((message) => (
            <MessageItem key={message.id}>
              <MessageHeader onClick={() => handleToggle(message)}>
                <Arrow>{openedId === message.id ? "▼" : "▶"}</Arrow>

                <ReadDot $read={message.readYn === "Y"} />

                <MessageMain>
                  <SenderName>{message.senderNickname || "관리자"}</SenderName>

                  <MessageTitle $read={message.readYn === "Y"}>
                    {message.title}
                  </MessageTitle>
                </MessageMain>

                <RightArea>
                  <Tag>{reasonLabel[message.reasonType]}</Tag>

                  <DateText>{formatDate(message.createdAt)}</DateText>

                  <DeleteButton
                    type="button"
                    onClick={(evt) => handleDelete(evt, message.id)}
                  >
                    삭제
                  </DeleteButton>
                </RightArea>
              </MessageHeader>

              {openedId === message.id && (
                <MessageContent>{message.content}</MessageContent>
              )}
            </MessageItem>
          ))
        )}
      </MessageCard>
    </MyPageLayout>
  );
}

function formatDate(value) {
  if (!value) return "";

  return String(value).replace("T", " ").slice(0, 16);
}

const Title = styled.h1`
  font-size: 32px;
  color: #00a982;
  margin-bottom: 24px;
`;

const TabList = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 22px;
`;

const TabButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 10px 24px;
  background: ${({ $active }) => ($active ? "#00b894" : "#e9fbf4")};
  color: ${({ $active }) => ($active ? "white" : "#00a982")};
  font-weight: 700;
  cursor: pointer;
`;

const MessageCard = styled.section`
  background: #e9fbf4;
  border-radius: 14px;
  padding: 24px;
  min-height: 420px;
`;

const MessageItem = styled.div`
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
`;

const MessageHeader = styled.div`
  min-height: 68px;
  padding: 0 20px;

  display: flex;
  align-items: center;
  gap: 14px;

  cursor: pointer;
`;

const Arrow = styled.span`
  width: 18px;
  flex-shrink: 0;
  color: #555;
  font-size: 14px;
`;

const ReadDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $read }) => ($read ? "#ccc" : "#00b894")};
`;

const MessageMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const SenderName = styled.div`
  font-size: 13px;
  color: #888;
  margin-bottom: 4px;
`;

const MessageTitle = styled.strong`
  display: block;
  color: ${({ $read }) => ($read ? "#777" : "#222")};
  font-weight: ${({ $read }) => ($read ? 500 : 800)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RightArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const Tag = styled.span`
  min-width: 58px;
  text-align: center;
  border-radius: 999px;
  padding: 5px 10px;
  background: #d9f6ec;
  color: #00a982;
  font-size: 13px;
  font-weight: 700;
`;

const DateText = styled.span`
  color: #888;
  font-size: 13px;
`;

const DeleteButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 7px 14px;
  background: #f1f1f1;
  color: #555;
  cursor: pointer;
`;

const MessageContent = styled.div`
  padding: 18px 54px 24px;
  color: #555;
  line-height: 1.7;
  border-top: 1px solid #eee;
`;

const EmptyBox = styled.div`
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-weight: 700;
`;
