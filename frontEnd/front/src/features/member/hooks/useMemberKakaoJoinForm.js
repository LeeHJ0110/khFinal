import { useState } from "react";
import {
  checkNickname,
  kakaoJoin,
  sendPhoneAuthCode,
  verifyPhoneAuthCode,
} from "../api/memberApi";

export default function useMemberKakaoJoinForm(socialId, marketingAgreeYn) {
  const [isSuccess, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    phone: "",
    address: "",
    addressDetail: "",
    zipCode: "",
  });

  const [nicknameMessage, setNicknameMessage] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const [isNicknameChecked, setNicknameChecked] = useState(false);

  const [authCode, setAuthCode] = useState("");
  const [phoneAuthMessage, setPhoneAuthMessage] = useState("");
  const [isPhoneAuthSent, setIsPhoneAuthSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  function formatPhoneNumber(value) {
    const numbers = value.replace(/[^0-9]/g, "");

    if (numbers.length <= 3) {
      return numbers;
    }

    if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    }

    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
      7,
      11,
    )}`;
  }

  function getOnlyPhoneNumber(value) {
    return value.replace(/[^0-9]/g, "");
  }

  function validateEmail(email) {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!email) {
      return "";
    }

    if (!regex.test(email)) {
      return "이메일 형식이 올바르지 않습니다.";
    }

    return "올바른 이메일 형식입니다.";
  }

  function validatePhone(phone) {
    const numbers = getOnlyPhoneNumber(phone);

    if (!numbers) {
      return "";
    }

    if (!/^010\d{8}$/.test(numbers)) {
      return "전화번호 형식이 올바르지 않습니다.";
    }

    return "올바른 전화번호입니다.";
  }

  function handleChange(evt) {
    const { name, value } = evt.target;

    let nextValue = value;

    if (name === "phone") {
      const numbers = getOnlyPhoneNumber(value);

      if (numbers.length > 11) {
        return;
      }

      nextValue = formatPhoneNumber(numbers);
      setPhoneMessage(validatePhone(nextValue));
      setPhoneAuthMessage("");
      setIsPhoneAuthSent(false);
      setIsPhoneVerified(false);
      setAuthCode("");
    }

    if (name === "email") {
      setEmailMessage(validateEmail(nextValue));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
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

  async function handleSendPhoneAuthCode() {
    const phoneOnlyNumber = getOnlyPhoneNumber(formData.phone);

    if (!phoneOnlyNumber) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    if (!/^010\d{8}$/.test(phoneOnlyNumber)) {
      alert("전화번호는 010으로 시작하는 11자리 숫자여야 합니다.");
      return;
    }

    try {
      await sendPhoneAuthCode(phoneOnlyNumber);
      setIsPhoneAuthSent(true);
      setIsPhoneVerified(false);
      setAuthCode("");
      setPhoneAuthMessage("인증번호가 발송되었습니다.");
    } catch (err) {
      console.error(err);
      setPhoneAuthMessage("인증번호 발송에 실패했습니다.");
    }
  }

  async function handleVerifyPhoneAuthCode() {
    const phoneOnlyNumber = getOnlyPhoneNumber(formData.phone);

    if (!authCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    try {
      const resp = await verifyPhoneAuthCode(phoneOnlyNumber, authCode);

      if (resp.data === true) {
        setIsPhoneVerified(true);
        setPhoneAuthMessage("전화번호 인증이 완료되었습니다.");
      } else {
        setIsPhoneVerified(false);
        setPhoneAuthMessage("인증번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error(err);
      setIsPhoneVerified(false);
      setPhoneAuthMessage("인증번호 확인에 실패했습니다.");
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

    const phoneOnlyNumber = getOnlyPhoneNumber(formData.phone);

    if (!phoneOnlyNumber) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    if (!/^010\d{8}$/.test(phoneOnlyNumber)) {
      alert("전화번호는 010으로 시작하는 11자리 숫자여야 합니다.");
      return;
    }

    if (!isPhoneVerified) {
      alert("전화번호 인증을 완료해주세요.");
      return;
    }

    if (!formData.email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (!formData.address.trim()) {
      alert("주소를 입력해주세요.");
      return;
    }

    if (!formData.addressDetail.trim()) {
      alert("상세주소를 입력해주세요.");
      return;
    }

    const requestData = {
      ...formData,
      phone: phoneOnlyNumber,
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
    phoneMessage,
    isSuccess,
    emailMessage,

    authCode,
    setAuthCode,
    phoneAuthMessage,
    isPhoneVerified,
    isPhoneAuthSent,
    handleSendPhoneAuthCode,
    handleVerifyPhoneAuthCode,
  };
}
