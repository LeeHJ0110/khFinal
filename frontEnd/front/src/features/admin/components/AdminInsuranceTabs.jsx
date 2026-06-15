import styled from "styled-components";

const TABS = [
  {
    label: "승인 대기",
    value: "WAITING",
  },
  {
    label: "승인 완료",
    value: "APPROVED",
  },
  {
    label: "반려",
    value: "REJECTED",
  },
];

export default function AdminInsuranceTabs({ status, onChange }) {
  return (
    <TabArea>
      {TABS.map((tab) => (
        <TabButton
          key={tab.value}
          $active={status === tab.value}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </TabButton>
      ))}
    </TabArea>
  );
}

const TabArea = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
`;

const TabButton = styled.button`
  padding: 10px 18px;
  border: 1px solid ${({ $active }) => ($active ? "#00a37a" : "#ddd")};
  border-radius: 999px;
  background-color: ${({ $active }) => ($active ? "#d9f5ec" : "white")};
  color: ${({ $active }) => ($active ? "#007a5c" : "#333")};
  font-weight: ${({ $active }) => ($active ? 800 : 500)};
  cursor: pointer;
`;
