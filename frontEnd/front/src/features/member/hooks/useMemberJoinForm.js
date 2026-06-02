import { useEffect, useState } from "react";
import { join, checkUsername, checkNickname } from "../api/memberApi";

export default function useMemberJoinForm(marketingAgreeYn = "N") {
  const [isSuccess, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordCheck: "",
    nickname: "",
    email: "",
    phone: "",
    address: "",
    addressDetail: "",
    zipCode: "",
  });

  const [usernameMessage, setUsernameMessage] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");

  const [isUsernameChecked, setUsernameChecked] = useState(false);
  const [isNicknameChecked, setNicknameChecked] = useState(false);

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

  function validateUsername(username) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;

    if (!regex.test(username)) {
      return "아이디는 영문+숫자 조합 6~12자리여야 합니다.";
    }

    return "";
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
    }

    setFormData((prev) => {
      return { ...prev, [name]: nextValue };
    });

    if (name === "username") {
      setUsernameChecked(false);

      if (!nextValue) {
        setUsernameMessage("");
      } else {
        setUsernameMessage(validateUsername(nextValue));
      }
    }

    if (name === "nickname") {
      setNicknameChecked(false);
      setNicknameMessage("");
    }
  }

  useEffect(() => {
    if (!formData.passwordCheck) {
      setPasswordMessage("");
      return;
    }

    if (formData.password === formData.passwordCheck) {
      setPasswordMessage("비밀번호가 일치합니다.");
    } else {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    }
  }, [formData.password, formData.passwordCheck]);

  async function handleCheckUsername() {
    if (!formData.username) {
      alert("아이디를 입력해주세요.");
      return;
    }

    const message = validateUsername(formData.username);

    if (message) {
      setUsernameMessage(message);
      setUsernameChecked(false);
      return;
    }

    const resp = await checkUsername(formData.username);

    if (resp.data === true) {
      setUsernameMessage("사용 가능한 아이디입니다.");
      setUsernameChecked(true);
    } else {
      setUsernameMessage("이미 사용중인 아이디입니다.");
      setUsernameChecked(false);
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

    const usernameError = validateUsername(formData.username);

    if (usernameError) {
      alert(usernameError);
      setUsernameMessage(usernameError);
      return;
    }

    if (!isUsernameChecked) {
      alert("아이디 중복체크를 해주세요.");
      return;
    }

    if (!isNicknameChecked) {
      alert("닉네임 중복체크를 해주세요.");
      return;
    }

    if (formData.password !== formData.passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const phoneOnlyNumber = getOnlyPhoneNumber(formData.phone);

    if (!/^010\d{8}$/.test(phoneOnlyNumber)) {
      alert("전화번호는 010으로 시작하는 11자리 숫자여야 합니다.");
      return;
    }

    const requestData = {
      ...formData,
      phone: phoneOnlyNumber,
      memberMarketingAgreeYn: marketingAgreeYn,
    };

    const resp = await join(requestData);

    if (resp.status === 201) {
      setSuccess(true);
    }
  }

  return {
    handleChange,
    handleSubmit,
    handleCheckUsername,
    handleCheckNickname,
    formData,
    isSuccess,
    usernameMessage,
    nicknameMessage,
    passwordMessage,
    phoneMessage,
  };
}
