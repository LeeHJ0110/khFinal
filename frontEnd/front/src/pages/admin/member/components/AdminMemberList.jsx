import styled from "styled-components";

export default function AdminMemberList({
  members,
  selectedMemberId,
  onSelect,
}) {
  if (!members || members.length === 0) {
    return <EmptyBox>조회된 회원이 없습니다.</EmptyBox>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>닉네임</th>
          <th>아이디</th>
          <th>강아지</th>
          <th>고양이</th>
          <th>광고동의</th>
          <th>상태</th>
          <th>권한</th>
          <th>가입일</th>
        </tr>
      </thead>

      <tbody>
        {members.map((member) => (
          <tr
            key={member.memberId}
            className={selectedMemberId === member.memberId ? "active" : ""}
            onClick={() => onSelect(member.memberId)}
          >
            <td>{member.nickname || "-"}</td>
            <td>{member.username || "-"}</td>
            <td>{member.hasDog ? "O" : "-"}</td>
            <td>{member.hasCat ? "O" : "-"}</td>
            <td>{member.marketingAgreeYn === "Y" ? "동의" : "미동의"}</td>
            <td>
              {member.status === "A"
                ? "활동중"
                : member.status === "S"
                  ? "정지중"
                  : member.status}
            </td>

            <td>
              {member.role === "U"
                ? "일반회원"
                : member.role === "A"
                  ? "총관리자"
                  : member.role === "D"
                    ? "수의사"
                    : member.role === "S"
                      ? "판매관리자"
                      : member.role === "B"
                        ? "게시판관리자"
                        : member.role}
            </td>
            <td>{formatDate(member.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function formatDate(value) {
  if (!value) return "-";
  return value.substring(0, 10);
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;

  th,
  td {
    padding: 14px 12px;
    border-bottom: 1px solid #eee;
    text-align: center;
    font-size: 14px;
  }

  th {
    background-color: #f8f8f8;
    font-weight: 700;
  }

  tbody tr {
    cursor: pointer;
  }

  tbody tr:hover {
    background-color: #fafafa;
  }

  tbody tr.active {
    background-color: #f1f1f1;
  }
`;

const EmptyBox = styled.div`
  padding: 80px 0;
  border: 1px solid #eee;
  text-align: center;
  color: #777;
`;
