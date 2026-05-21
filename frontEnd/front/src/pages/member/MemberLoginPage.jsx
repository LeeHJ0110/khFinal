import { useNavigate } from "react-router-dom";
import useFormData from "../../shared/layouts/hooks/useFormData";
import useMemberLogin from "../../features/member/hooks/useMemberLogin";

export default function MemberLoginPage() {
  const initState = {
    username: "",
    password: "",
  };
  const { formData, handleChange } = useFormData(initState);
  const { handleLogin, error } = useMemberLogin();
  const navigate = useNavigate();

  async function handleSubmit(evt) {
    evt.preventDefault();
    await handleLogin(formData);
    navigate("/");
  }

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
          type="password"
          placeholder="비밀번호"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
        <input type="submit" value="로그인" />
      </form>
      <h3>{error}</h3>
    </div>
  );
}
