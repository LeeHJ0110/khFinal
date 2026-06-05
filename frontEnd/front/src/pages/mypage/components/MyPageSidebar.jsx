import { useRef } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import useMypageMember from "../../../features/mypage/member/hooks/useMypageMember";
import { useDispatch } from "react-redux";
import { logout } from "../../../features/member/store/memberSlice";

export default function MyPageSidebar() {
  const { member, loading, handleUploadProfileImage } = useMypageMember();

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    dispatch(logout());
    navigate("/member/login");
  }

  function handleClickCamera() {
    fileInputRef.current?.click();
  }

  async function handleChangeProfileImage(evt) {
    const file = evt.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    await handleUploadProfileImage(file);

    evt.target.value = "";
  }

  return (
    <SideBar>
      <ProfileBox>
        <ProfileImg>
          {member?.profileImageUrl ? (
            <img src={member.profileImageUrl} alt="프로필 이미지" />
          ) : (
            <DefaultProfile>🐾</DefaultProfile>
          )}
        </ProfileImg>

        <CameraBtn type="button" onClick={handleClickCamera}>
          📷
        </CameraBtn>

        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChangeProfileImage}
        />

        <ProfileName>
          {loading ? "로딩중..." : member?.nickname || "회원"}
        </ProfileName>
      </ProfileBox>

      <MenuArea>
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
      </MenuArea>

      <LogoutButton type="button" onClick={handleLogout}>
        로그아웃
      </LogoutButton>
    </SideBar>
  );
}

const SideBar = styled.aside`
  width: 260px;
  background: #e9fbf4;
  padding: 42px 0 24px;
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
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
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DefaultProfile = styled.div`
  font-size: 42px;
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

const HiddenFileInput = styled.input`
  display: none;
`;

const ProfileName = styled.h2`
  font-size: 21px;
  font-weight: 800;
`;

const MenuArea = styled.div`
  flex: 1;
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

const LogoutButton = styled.button`
  margin: 20px;
  height: 48px;

  border: none;
  border-radius: 12px;

  background: #ff6b6b;
  color: white;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;

  &:hover {
    background: #fa5252;
  }
`;
