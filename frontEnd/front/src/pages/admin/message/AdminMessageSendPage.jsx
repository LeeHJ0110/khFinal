import { useEffect, useState } from "react";
import styled from "styled-components";

import AdminLayout from "../components/AdminLayout";
import useAdminMember from "../../../features/admin/hooks/useAdminMember";
import useAdminMessage from "../../../features/admin/hooks/useAdminMessage";
import AdminMemberFilter from "../member/components/AdminMemberFilter";
import AdminMemberPagination from "../member/components/AdminMemberPagination";

export default function AdminMessageSendPage() {
  const {
    members,
    keyword,
    setKeyword,
    filters,
    page,
    totalPages,
    fetchMembers,
    toggleFilter,
    searchType,
    setSearchType,
  } = useAdminMember();

  const { handleBulkSendMessage } = useAdminMessage();

  const [targetType, setTargetType] = useState("SELECTED");
  const [checkedIds, setCheckedIds] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    reasonType: "NOTICE",
  });

  useEffect(() => {
    fetchMembers(0);
  }, []);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function getMemberId(member) {
    return member.memberId ?? member.id;
  }

  function toggleMember(memberId) {
    setCheckedIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  }

  function toggleAll() {
    if (members.length > 0 && checkedIds.length === members.length) {
      setCheckedIds([]);
      return;
    }

    setCheckedIds(members.map((member) => getMemberId(member)));
  }

  function handleSearchWithClear() {
    setCheckedIds([]);
    fetchMembers(0);
  }

  function toggleFilterWithClear(key, value) {
    setCheckedIds([]);
    toggleFilter(key, value);
  }

  function changePageWithClear(nextPage) {
    setCheckedIds([]);
    fetchMembers(nextPage);
  }

  function getRoleText(role) {
    switch (role) {
      case "A":
        return "관리자";
      case "D":
        return "수의사";
      case "S":
        return "판매관리자";
      case "B":
        return "게시판관리자";
      default:
        return "일반회원";
    }
  }

  function getTargetText() {
    if (targetType === "ALL") {
      return "전체 회원에게 발송하시겠습니까?";
    }

    if (targetType === "SEARCH_RESULT") {
      return "현재 검색/필터 결과 전체 회원에게 발송하시겠습니까?";
    }

    return `${checkedIds.length}명의 선택 회원에게 발송하시겠습니까?`;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    if (targetType === "SELECTED" && checkedIds.length === 0) {
      alert("쪽지를 받을 회원을 선택해주세요.");
      return;
    }

    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (!window.confirm(getTargetText())) {
      return;
    }

    const isSuccess = await handleBulkSendMessage({
      targetType,
      receiverIds: checkedIds,
      searchType,
      keyword,
      petType: filters.petType || null,
      marketingAgreeYn: filters.marketingAgreeYn || null,
      status: filters.status || null,
      role: filters.role || null,
      adminOnly: filters.adminOnly || null,
      title: formData.title,
      content: formData.content,
      reasonType: formData.reasonType,
    });

    if (!isSuccess) {
      return;
    }

    setCheckedIds([]);
    setTargetType("SELECTED");
    setFormData({
      title: "",
      content: "",
      reasonType: "NOTICE",
    });
  }

  return (
    <AdminLayout>
      <Container>
        <Title>쪽지 일괄 발송</Title>

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
                handleSearchWithClear();
              }
            }}
          />

          <SearchButton type="button" onClick={handleSearchWithClear}>
            검색
          </SearchButton>
        </SearchArea>

        <AdminMemberFilter filters={filters} onToggle={toggleFilterWithClear} />

        <ContentArea>
          <MemberArea>
            <SectionTitle>회원 선택</SectionTitle>

            <CheckAllRow>
              <label>
                <input
                  type="checkbox"
                  checked={
                    members.length > 0 && checkedIds.length === members.length
                  }
                  onChange={toggleAll}
                  disabled={targetType !== "SELECTED"}
                />
                현재 페이지 전체 선택
              </label>

              <CountText>{checkedIds.length}명 선택됨</CountText>
            </CheckAllRow>

            <MemberList>
              {members.map((member) => {
                const memberId = getMemberId(member);

                return (
                  <MemberItem key={memberId}>
                    <CheckBox
                      type="checkbox"
                      checked={checkedIds.includes(memberId)}
                      onChange={() => toggleMember(memberId)}
                      disabled={targetType !== "SELECTED"}
                    />

                    <MemberText>
                      <TopLine>
                        <strong>{member.nickname || "-"}</strong>
                        <Username>{member.username || "-"}</Username>
                      </TopLine>

                      <SubLine>
                        <span>{member.email || "-"}</span>
                        <span>{member.phone || "-"}</span>
                      </SubLine>

                      <BadgeLine>
                        <Badge $active={member.hasDog}>강아지</Badge>
                        <Badge $active={member.hasCat}>고양이</Badge>
                        <Badge $active={member.marketingAgreeYn === "Y"}>
                          광고동의
                        </Badge>
                        <Badge $active={member.status === "S"}>정지</Badge>
                        <Badge $active={member.role !== "U"}>
                          {getRoleText(member.role)}
                        </Badge>
                      </BadgeLine>
                    </MemberText>
                  </MemberItem>
                );
              })}
            </MemberList>

            <AdminMemberPagination
              page={page}
              totalPages={totalPages}
              onChangePage={changePageWithClear}
            />
          </MemberArea>

          <FormArea onSubmit={handleSubmit}>
            <SectionTitle>쪽지 작성</SectionTitle>

            <Label>발송 대상</Label>
            <TargetArea>
              <label>
                <input
                  type="radio"
                  value="SELECTED"
                  checked={targetType === "SELECTED"}
                  onChange={(evt) => setTargetType(evt.target.value)}
                />
                선택 회원
              </label>

              <label>
                <input
                  type="radio"
                  value="SEARCH_RESULT"
                  checked={targetType === "SEARCH_RESULT"}
                  onChange={(evt) => {
                    setCheckedIds([]);
                    setTargetType(evt.target.value);
                  }}
                />
                검색 결과 전체
              </label>

              <label>
                <input
                  type="radio"
                  value="ALL"
                  checked={targetType === "ALL"}
                  onChange={(evt) => {
                    setCheckedIds([]);
                    setTargetType(evt.target.value);
                  }}
                />
                전체 회원
              </label>
            </TargetArea>

            <Label>분류</Label>
            <Select
              name="reasonType"
              value={formData.reasonType}
              onChange={handleChange}
            >
              <option value="NOTICE">공지</option>
              <option value="SCHEDULE">일정</option>
              <option value="INSURANCE">보험</option>
              <option value="COMMUNITY">커뮤니티</option>
              <option value="AD">광고</option>
            </Select>

            <Label>제목</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="쪽지 제목"
            />

            <Label>내용</Label>
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="쪽지 내용을 입력하세요"
            />

            <SendButton type="submit">쪽지 발송</SendButton>
          </FormArea>
        </ContentArea>
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

const SearchSelect = styled.select`
  width: 120px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
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
  grid-template-columns: 0.8fr 1.2fr;
  gap: 24px;
  margin-top: 24px;
`;

const MemberArea = styled.div`
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 16px;
  background-color: white;
`;

const FormArea = styled.form`
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 16px;
  background-color: white;
  position: sticky;
  top: 24px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 16px;
  font-size: 20px;
`;

const CheckAllRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const CountText = styled.span`
  color: #2563eb;
  font-weight: 700;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  max-height: 560px;
  overflow-y: auto;
`;

const MemberItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 14px;
  border: 1px solid #eee;
  border-radius: 12px;
`;

const CheckBox = styled.input`
  margin-top: 4px;
`;

const MemberText = styled.div`
  flex: 1;
`;

const TopLine = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Username = styled.span`
  color: #777;
  font-size: 13px;
`;

const SubLine = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 6px;
  color: #777;
  font-size: 13px;
`;

const BadgeLine = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 999px;
  background-color: ${({ $active }) => ($active ? "#111" : "#f1f1f1")};
  color: ${({ $active }) => ($active ? "white" : "#999")};
  font-size: 12px;
`;

const Label = styled.label`
  margin-bottom: 6px;
  display: block;
  font-weight: 700;
  font-size: 14px;
`;

const TargetArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;

  label {
    cursor: pointer;
  }

  input {
    margin-right: 8px;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 40px;
  margin-bottom: 14px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  margin-bottom: 14px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 320px;
  margin-bottom: 16px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
`;

const SendButton = styled.button`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 8px;
  background-color: #2563eb;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;
