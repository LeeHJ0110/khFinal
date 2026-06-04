import { Link } from "react-router-dom";

export default function GuestMenu({ currentPath = "/home" }) {
  const loginPath = createLoginPath(currentPath);

  return (
    <div className="guest-menu">
      <Link to={loginPath} className="header-login-btn">
        로그인
      </Link>

      <Link to="/member/join" className="header-join-btn">
        회원가입
      </Link>
    </div>
  );
}

function createLoginPath(currentPath) {
  if (!currentPath) {
    return "/member/login";
  }

  if (currentPath.startsWith("/member/login")) {
    return "/member/login";
  }

  if (currentPath.startsWith("/member/join")) {
    return "/member/login";
  }

  return `/member/login?redirect=${encodeURIComponent(currentPath)}`;
}
