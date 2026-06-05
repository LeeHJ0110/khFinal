import { NavLink } from "react-router-dom";
import styled from "styled-components";

export default function AdminSidebar() {
  return (
    <Sidebar>
      <ProfileArea>
        <ProfileImage src="/images/default-profile.png" alt="관리자 프로필" />
        <AdminName>관리자</AdminName>
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

const ProfileImage = styled.img`
  width: 116px;
  height: 116px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  background-color: white;
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
