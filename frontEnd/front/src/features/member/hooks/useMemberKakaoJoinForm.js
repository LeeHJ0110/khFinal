import { useState } from "react";
import { checkNickname, kakaoJoin } from "../api/memberApi";

export default function useMemberKakaoJoinForm(socialId, marketingAgreeYn) {
  const [isSuccess, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    phone: "",
    address: "",
    addressDetail: "",
  });

  const [nicknameMessage, setNicknameMessage] = useState("");
  const [isNicknameChecked, setNicknameChecked] = useState(false);

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "nickname") {
      setNicknameChecked(false);
      setNicknameMessage("");
    }
  }

  async function handleCheckNickname() {
    if (!formData.nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const resp = await checkNickname(formData.nickname);

    if (resp.data === true) {
      setNicknameMessage("사용 가능한 닉네임입니다.");
      setNicknameChecked(true);
    } else {
      setNicknameMessage("이미 사용중인 닉네임입니다.");
      setNicknameChecked(false);
    }
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    if (!socialId) {
      alert("카카오 인증 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    if (!isNicknameChecked) {
      alert("닉네임 중복체크를 해주세요.");
      return;
    }

    if (!formData.phone) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    if (!formData.email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!formData.address) {
      alert("주소를 입력해주세요.");
      return;
    }

    const requestData = {
      ...formData,
      socialId,
      memberMarketingAgreeYn: marketingAgreeYn,
    };

    const resp = await kakaoJoin(requestData);

    if (resp.status === 201) {
      setSuccess(true);
    }
  }

  return {
    formData,
    handleChange,
    handleSubmit,
    handleCheckNickname,
    nicknameMessage,
    isSuccess,
  };
}
