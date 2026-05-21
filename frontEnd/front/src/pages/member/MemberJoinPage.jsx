import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMemberJoinForm from "../../features/member/hooks/useMemberJoinForm";

export default function MemberJoinPage() {
  const navigate = useNavigate();
  const { formData, handleChange, handleSubmit, isSuccess } =
    useMemberJoinForm();

  useEffect(() => {
    if (isSuccess) {
      navigate("/member/login");
    }
  }, [isSuccess]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="아이디"
          name="username"
          onChange={handleChange}
          value={formData.username}
        />
        <input
          type="text"
          placeholder="닉네임"
          name="nickname"
          onChange={handleChange}
          value={formData.nickname}
        />
        <input
          type="password"
          placeholder="비밀번호"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          name="passwordCheck"
          onChange={handleChange}
          value={formData.passwordCheck}
        />
        <input
          type="text"
          placeholder="전화번호"
          name="phone"
          onChange={handleChange}
          value={formData.phone}
        />
        <input
          type="text"
          placeholder="이메일"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />
        <input
          type="text"
          placeholder="주소"
          name="address"
          onChange={handleChange}
          value={formData.address}
        />
        <input
          type="text"
          placeholder="상세주소"
          name="addressDetail"
          onChange={handleChange}
          value={formData.addressDetail}
        />
        <input type="submit" value="회원가입" />
      </form>
    </div>
  );
}
