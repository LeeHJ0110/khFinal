import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  updateMemberStatus,
  updateMemberRole,
  cleanMemberNickname,
} from "../../../../features/admin/api/adminMemberApi";

export default function AdminMemberDetail({ member, onUpdated }) {
  const [status, setStatus] = useState("A");
  const [role, setRole] = useState("U");

  useEffect(() => {
    if (member) {
      setStatus(member.status);
      setRole(member.role);
    }
  }, [member]);

  if (!member) {
    return <EmptyDetail>회원을 선택하면 상세 정보가 표시됩니다.</EmptyDetail>;
  }

  async function handleSaveStatus() {
    await updateMemberStatus(member.memberId, status);
    alert("회원 상태가 변경되었습니다.");

    if (onUpdated) {
      await onUpdated();
    }
  }

  async function handleSaveRole() {
    await updateMemberRole(member.memberId, role);

    alert("회원 권한이 변경되었습니다.");

    if (onUpdated) {
      await onUpdated();
    }
  }
  async function handleCleanNickname() {
    if (!window.confirm("해당 회원의 닉네임을 정정하시겠습니까?")) {
      return;
    }

    const resp = await cleanMemberNickname(member.memberId);

    alert(`닉네임이 ${resp.data} 으로 변경되었습니다.`);

    if (onUpdated) {
      await onUpdated();
    }
  }
  return (
    <DetailCard>
      <ProfileImg
        src={member.profileImageUrl || "/images/default-profile.png"}
        alt="프로필"
      />

      <Nickname>{member.nickname || "-"}</Nickname>
      <Username>{member.username || "-"}</Username>

      <CleanNicknameButton onClick={handleCleanNickname}>
        닉네임 정정
      </CleanNicknameButton>

      <InfoList>
        <InfoRow>
          <span>이메일</span>
          <strong>{member.email || "-"}</strong>
        </InfoRow>

        <InfoRow>
          <span>전화번호</span>
          <strong>{member.phone || "-"}</strong>
        </InfoRow>

        <InfoRow>
          <span>주소</span>
          <strong>{member.address || "-"}</strong>
        </InfoRow>

        <InfoRow>
          <span>상세주소</span>
          <strong>{member.addressDetail || "-"}</strong>
        </InfoRow>

        <InfoRow>
          <span>광고동의</span>
          <strong>{member.marketingAgreeYn === "Y" ? "동의" : "미동의"}</strong>
        </InfoRow>

        <InfoRow>
          <span>상태</span>
          <Select
            value={status}
            onChange={(evt) => setStatus(evt.target.value)}
          >
            <option value="A">활동중</option>
            <option value="S">정지중</option>
          </Select>
        </InfoRow>

        <InfoRow>
          <span>권한</span>

          <Select value={role} onChange={(evt) => setRole(evt.target.value)}>
            <option value="U">유저</option>
            <option value="A">관리자</option>
            <option value="D">수의사</option>
            <option value="S">판매관리자</option>
            <option value="B">게시판관리자</option>
          </Select>
        </InfoRow>
        <InfoRow>
          <span>가입일</span>
          <strong>{formatDate(member.createdAt)}</strong>
        </InfoRow>
      </InfoList>

      <ButtonArea>
        <SaveButton onClick={handleSaveStatus}>상태 저장</SaveButton>
        <SaveButton onClick={handleSaveRole}>권한 저장</SaveButton>
      </ButtonArea>
    </DetailCard>
  );
}

function getRoleText(role) {
  switch (role) {
    case "U":
      return "유저";
    case "A":
      return "관리자";
    case "D":
      return "수의사";
    case "S":
      return "판매관리자";
    case "B":
      return "게시판관리자";
    default:
      return role || "-";
  }
}

function formatDate(value) {
  if (!value) return "-";
  return value.substring(0, 10);
}

const DetailCard = styled.div`
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 16px;
  background-color: white;
  text-align: center;
`;

const ProfileImg = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #eee;
`;

const Nickname = styled.h2`
  margin-top: 16px;
  margin-bottom: 4px;
`;

const Username = styled.p`
  color: #777;
  margin-bottom: 24px;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  font-size: 14px;

  span {
    color: #777;
  }

  strong {
    text-align: right;
  }
`;

const Select = styled.select`
  width: 120px;
  height: 34px;
  padding: 0 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const SaveButton = styled.button`
  width: 100%;
  height: 42px;
  margin-top: 20px;
  border: none;
  border-radius: 10px;
  background-color: #111;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

const EmptyDetail = styled.div`
  padding: 80px 24px;
  border: 1px solid #eee;
  border-radius: 16px;
  text-align: center;
  color: #777;
  background-color: white;
`;

const ButtonArea = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;
const CleanNicknameButton = styled.button`
  height: 34px;
  padding: 0 14px;
  margin-bottom: 20px;
  border: 1px solid #ffb4b4;
  border-radius: 8px;
  background-color: #fff5f5;
  color: #d93636;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: #ffecec;
  }
`;
