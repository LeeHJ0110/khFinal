export default function GuestMenu() {
  return (
    <div className="guest-menu">
      {/* member/login */}
      <a href="member/login" className="header-login-btn">
        로그인
      </a>
      {/* member/join */}
      <a href="member/join" className="header-join-btn">
        회원가입
      </a>
    </div>
  );
}
