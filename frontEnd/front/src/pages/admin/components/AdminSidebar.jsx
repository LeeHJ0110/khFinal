import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { getAdminMe } from "../../../features/admin/api/adminMemberApi";
export default function AdminSidebar() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    async function fetchAdmin() {
      const resp = await getAdminMe();
      setAdmin(resp.data);
    }

    fetchAdmin();
  }, []);
  return (
    <Sidebar>
      <ProfileArea>
        <ProfileImg>
          {admin?.profileImageUrl ? (
            <img src={admin.profileImageUrl} alt="프로필 이미지" />
          ) : (
            <DefaultProfile>👤</DefaultProfile>
          )}
        </ProfileImg>
        <AdminName>{admin?.nickname || "관리자"}</AdminName>
        <AdminRole>{getRoleText(admin?.role)}</AdminRole>
      </ProfileArea>

      <MenuArea>
        <MenuLink to="/admin/member">회원 조회</MenuLink>
        <MenuLink to="/admin/message/send">쪽지 발송</MenuLink>
        <MenuLink to="/admin/message/sent">보낸 쪽지함</MenuLink>
        <MenuLink to="/admin/delivery">배송 관리</MenuLink>
        <MenuLink to="/admin/report">신고 이력</MenuLink>
        <MenuLink to="/admin/insurance">보험 신청 관리</MenuLink>
      </MenuArea>
    </Sidebar>
  );
}
function getRoleText(role) {
  switch (role) {
    case "A":
      return "총관리자";
    case "D":
      return "수의사";
    case "S":
      return "판매관리자";
    case "B":
      return "게시판관리자";
    default:
      return "";
  }
}
const Sidebar = styled.aside`
  width: 240px;
  min-height: 100vh;
  background-color: #e9fbf4;
  border-right: 1px solid #d5eee5;
  flex-shrink: 0;
`;

const ProfileArea = styled.div`
  padding: 36px 20px 28px;
  text-align: center;
`;

const AdminName = styled.h2`
  margin-top: 18px;
  font-size: 22px;
  font-weight: 800;
  color: #111;
`;

const MenuArea = styled.nav`
  margin-top: 8px;
`;

const MenuLink = styled(NavLink)`
  display: block;
  padding: 16px 28px;
  color: #222;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;

  &:hover {
    background-color: #d8f3e9;
  }

  &.active {
    background-color: #9fe0ca;
    color: #008866;
    font-weight: 800;
  }
`;
const AdminRole = styled.p`
  margin-top: 4px;
  font-size: 13px;
  color: #666;
`;
const ProfileImg = styled.div`
  width: 120px;
  height: 120px;

  margin: 0 auto;

  border-radius: 50%;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: white;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
`;

const DefaultProfile = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 46px;
  line-height: 1;
`;
