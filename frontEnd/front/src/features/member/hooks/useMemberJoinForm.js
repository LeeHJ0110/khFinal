import { useEffect, useState } from "react";
import { join, checkUsername, checkNickname } from "../api/memberApi";

export default function useMemberJoinForm() {
  const [isSuccess, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordCheck: "",
    nickname: "",
    socialId: "",
    email: "",
    phone: "",
    address: "",
    addressDetail: "",
  });

  const [usernameMessage, setUsernameMessage] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [isUsernameChecked, setUsernameChecked] = useState(false);
  const [isNicknameChecked, setNicknameChecked] = useState(false);

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormData((prev) => {
      return { ...prev, [name]: value };
    });

    if (name === "username") {
      setUsernameChecked(false);
      setUsernameMessage("");
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

    const resp = await join(formData);

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
  };
}
