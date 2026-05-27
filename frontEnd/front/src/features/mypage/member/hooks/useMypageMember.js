import { useEffect, useState } from "react";
import { getMyInfo, checkNickname, updateMyInfo } from "../api/mypageMemberApi";

export default function useMypageMember() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchMyInfo() {
    try {
      setLoading(true);
      setError("");

      const response = await getMyInfo();
      setMember(response.data);

      return response.data;
    } catch (err) {
      console.error(err);
      setError("회원 정보를 불러오지 못했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handleNicknameCheck(nickname) {
    if (!nickname.trim()) {
      alert("닉네임을 입력하세요.");
      return false;
    }

    try {
      await checkNickname(nickname);
      alert("사용 가능한 닉네임입니다.");
      return true;
    } catch (err) {
      console.error(err);
      alert("이미 사용 중인 닉네임입니다.");
      return false;
    }
  }

  async function handleUpdateMyInfo(formData) {
    try {
      setLoading(true);
      setError("");

      await updateMyInfo(formData);
      alert("회원 정보가 수정되었습니다.");

      await fetchMyInfo();

      return true;
    } catch (err) {
      console.error(err);
      alert("회원 정보 수정에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyInfo();
  }, []);

  return {
    member,
    loading,
    error,
    fetchMyInfo,
    handleNicknameCheck,
    handleUpdateMyInfo,
  };
}
