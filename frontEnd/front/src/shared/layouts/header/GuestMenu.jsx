import { Link } from "react-router-dom";

export default function GuestMenu() {
  return (
    <div className="guest-menu">
      <Link to="/member/login" className="header-login-btn">
        로그인
      </Link>

      <Link to="/member/join" className="header-join-btn">
        회원가입
      </Link>
    </div>
  );
}
