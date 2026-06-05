import { useEffect, useState } from "react";
import {
  getMyInfo,
  updateMyInfo,
  uploadProfileImage,
} from "../api/mypageMemberApi";
import { checkNickname } from "../../../member/api/memberApi";

export default function useMypageMember() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchMyInfo() {
    try {
      setLoading(true);

      const response = await getMyInfo();
      setMember(response.data);

      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateMyInfo(data) {
    try {
      await updateMyInfo(data);
      await fetchMyInfo();
      alert("회원 정보가 수정되었습니다.");
      return true;
    } catch (err) {
      console.error(err);
      alert("회원 정보 수정에 실패했습니다.");
      return false;
    }
  }

  async function handleNicknameCheck(nickname) {
    try {
      if (!nickname) {
        alert("닉네임을 입력하세요.");
        return false;
      }

      const response = await checkNickname(nickname);

      if (response.data === true) {
        alert("사용 가능한 닉네임입니다.");
        return true;
      }

      alert("이미 사용 중인 닉네임입니다.");
      return false;
    } catch (err) {
      console.error(err);
      alert("닉네임 중복 확인에 실패했습니다.");
      return false;
    }
  }

  async function handleUploadProfileImage(file) {
    try {
      if (!file) {
        alert("이미지를 선택해주세요.");
        return false;
      }

      await uploadProfileImage(file);
      await fetchMyInfo();

      alert("프로필 이미지가 변경되었습니다.");
      return true;
    } catch (err) {
      console.error(err);
      alert("프로필 이미지 업로드에 실패했습니다.");
      return false;
    }
  }

  useEffect(() => {
    fetchMyInfo();
  }, []);

  return {
    member,
    loading,
    fetchMyInfo,
    handleUpdateMyInfo,
    handleNicknameCheck,
    handleUploadProfileImage,
  };
}
