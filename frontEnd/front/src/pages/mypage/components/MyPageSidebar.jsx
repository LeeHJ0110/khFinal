import styled from "styled-components";
import { NavLink } from "react-router-dom";
import useMypageMember from "../../../features/mypage/member/hooks/useMypageMember";

export default function MyPageSidebar() {
  const { member, loading } = useMypageMember();
  return (
    <SideBar>
      <ProfileBox>
        <ProfileImg />
        <CameraBtn>📷</CameraBtn>
        <ProfileName>
          {loading ? "로딩중..." : member?.nickname || "회원"}
        </ProfileName>
      </ProfileBox>

      <MenuList>
        <MenuItem to="/mypage" end>
          마이페이지 홈
        </MenuItem>

        <MenuItem to="/mypage/member-edit">회원 정보 수정</MenuItem>

        <MenuItem to="/mypage/pet-manage">반려동물 정보 관리</MenuItem>

        <MenuItem to="/mypage/message">쪽지함</MenuItem>

        <MenuItem to="/mypage/community">커뮤니티 이력</MenuItem>

        <MenuItem to="/mypage/delivery">배송지 관리</MenuItem>

        <MenuItem to="/mypage/orders">주문 내역</MenuItem>

        <MenuItem to="/mypage/points">포인트 내역</MenuItem>
      </MenuList>
    </SideBar>
  );
}

const SideBar = styled.aside`
  width: 260px;
  background: #e9fbf4;
  padding: 42px 0 24px;
  flex-shrink: 0;
`;

const ProfileBox = styled.div`
  position: relative;
  text-align: center;
  margin-bottom: 34px;
`;

const ProfileImg = styled.div`
  width: 116px;
  height: 116px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: #d9d9d9;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
`;

const CameraBtn = styled.button`
  position: absolute;
  top: 78px;
  left: 150px;

  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 3px solid white;

  background: #00b894;
  color: white;
  cursor: pointer;
`;

const ProfileName = styled.h2`
  font-size: 21px;
  font-weight: 800;
`;

const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled(NavLink)`
  padding: 17px 34px;
  font-size: 15px;
  color: #222;
  text-decoration: none;

  &.active {
    background: #a7e8d3;
    color: #009c7a;
    font-weight: 700;
  }

  &:hover {
    background: #d5f5ea;
  }
`;
