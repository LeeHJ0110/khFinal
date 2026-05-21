export default function UserMenu({ loginMember }) {
  const nickname = loginMember?.nickname || "냥냥러브";

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loginMember");

    window.location.href = "/";
  }

  return (
    <div className="user-menu">
      {/* 알림 */}
      <button type="button" className="header-alarm" aria-label="알림">
        🔔
      </button>

      {/* 로그인 사용자 정보 */}
      <button type="button" className="header-user">
        <span className="header-profile-img" />
        <span className="header-user-name">{nickname}님</span>
        <span className="user-arrow">⌄</span>
      </button>

      {/* 로그아웃 */}
      <button
        type="button"
        className="header-logout-btn"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
}
