import { useState } from "react";
import { join } from "../api/memberApi";

export default function useMemberJoinForm() {
  const [isSuccess, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nickname: "",
    socialId: "",
    email: "",
    phone: 0,
    address: "",
    addressDetail: "",
  });

  function handleChange(evt) {
    setFormData((prev) => {
      return { ...prev, [evt.target.name]: evt.target.value };
    });
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const resp = await join(formData);
    if (resp.status == 201) {
      setSuccess(true);
    }
  }

  return { handleChange, handleSubmit, formData, isSuccess };
}
