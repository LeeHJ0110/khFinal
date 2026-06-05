import styled from "styled-components";
import { useState } from "react";

import useAdminMember from "../../../features/admin/hooks/useAdminMember";
import AdminMemberFilter from "../member/components/AdminMemberFilter";
import AdminMemberList from "../member/components/AdminMemberList";
import AdminMemberDetail from "../member/components/AdminMemberDetail";
import AdminMemberPagination from "../member/components/AdminMemberPagination";
import AdminLayout from "../components/AdminLayout";
import useAdminMessage from "../../../features/admin/hooks/useAdminMessage";
import AdminMessageSendModal from "./components/AdminMessageSendModal";

export default function AdminMemberPage() {
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);
  const { handleSendMessage } = useAdminMessage();
  const {
    members,
    selectedMember,
    keyword,
    setKeyword,
    filters,
    page,
    totalPages,
    fetchMembers,
    fetchMemberDetail,
    handleSearch,
    toggleFilter,
    refresh,
    searchType,
    setSearchType,
  } = useAdminMember();

  return (
    <AdminLayout>
      <Container>
        <Title>회원 조회</Title>

        <SearchArea>
          <SearchSelect
            value={searchType}
            onChange={(evt) => setSearchType(evt.target.value)}
          >
            <option value="username">아이디</option>
            <option value="nickname">닉네임</option>
            <option value="email">이메일</option>
            <option value="phone">전화번호</option>
          </SearchSelect>

          <SearchInput
            placeholder="검색어 입력"
            value={keyword}
            onChange={(evt) => setKeyword(evt.target.value)}
            onKeyDown={(evt) => {
              if (evt.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </SearchArea>

        <AdminMemberFilter filters={filters} onToggle={toggleFilter} />

        <ContentArea>
          <ListArea>
            <AdminMemberList
              members={members}
              selectedMemberId={selectedMember?.memberId}
              onSelect={fetchMemberDetail}
            />

            <AdminMemberPagination
              page={page}
              totalPages={totalPages}
              onChangePage={fetchMembers}
            />
          </ListArea>

          <DetailArea>
            <AdminMemberDetail member={selectedMember} onUpdated={refresh} />

            {selectedMember && (
              <MessageButton onClick={() => setMessageModalOpen(true)}>
                쪽지 보내기
              </MessageButton>
            )}
          </DetailArea>
        </ContentArea>
        {isMessageModalOpen && selectedMember && (
          <AdminMessageSendModal
            member={selectedMember}
            onClose={() => setMessageModalOpen(false)}
            onSend={handleSendMessage}
          />
        )}
      </Container>
    </AdminLayout>
  );
}

const Container = styled.div`
  padding: 32px;
`;

const Title = styled.h1`
  margin-bottom: 24px;
  font-size: 28px;
`;

const SearchArea = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  width: 360px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const SearchButton = styled.button`
  width: 80px;
  border: none;
  border-radius: 8px;
  background-color: #111;
  color: white;
  cursor: pointer;
`;

const ContentArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  margin-top: 24px;
`;

const ListArea = styled.div``;

const DetailArea = styled.div``;

const MessageButton = styled.button`
  width: 100%;
  height: 42px;
  margin-top: 12px;
  border: none;
  border-radius: 8px;
  background-color: #2563eb;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

const SearchSelect = styled.select`
  width: 120px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;
