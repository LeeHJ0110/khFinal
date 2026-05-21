export default function GuestMenu() {
  return (
    <div className="guest-menu">
      <a href="/login" className="header-login-btn">
        로그인
      </a>

      <a href="/join" className="header-join-btn">
        회원가입
      </a>
    </div>
  );
}
