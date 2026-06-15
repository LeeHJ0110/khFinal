import "./Footer.css";

/*
  공통 Footer 메뉴 목록

  - 로그인/비로그인 상태와 관계없이 동일하게 사용
  - icon은 현재 임시 문자입니다.
  - 추후 아이콘 이미지가 준비되면 icon 자리에 이미지 경로를 넣어 교체하면 됩니다.
*/
const footerMenus = [
  { label: "건강관리", icon: "▣", path: "/healthCare" },
  { label: "스토어", icon: "□", path: "/store" },
  { label: "커뮤니티", icon: "♧", path: "/community" },
  { label: "일정관리", icon: "♢", path: "/healthCare/schedule" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* 브랜드 정보 영역 */}
        <section className="footer-brand">
          <div className="footer-brand-title">
            <span className="footer-brand-icon">⌂</span>
            <strong>PET&amp;I FOR</strong>
          </div>

          <p>반려동물 건강관리 서비스를 제공합니다.</p>

          <small>© 2026 PET&amp;I FOR. All rights reserved.</small>
        </section>

        {/* 서비스 소개 영역 */}
        <section className="footer-desc">
          <p>
            반려동물의 건강한 생활을 위한
            <br />
            맞춤 건강관리 서비스를 제공합니다.
          </p>
        </section>

        {/* 중앙 바로가기 메뉴 영역 */}
        <nav className="footer-menu" aria-label="푸터 바로가기 메뉴">
          {footerMenus.map((menu) => (
            <a href={menu.path} className="footer-menu-item" key={menu.label}>
              <span className="footer-menu-icon">{menu.icon}</span>
              <span>{menu.label}</span>
            </a>
          ))}
        </nav>

        {/* 연락처 영역 */}
        <section className="footer-contact">
          <h3>연락처</h3>

          <ul className="footer-contact-list">
            <li className="footer-contact-email">
              <span className="footer-contact-icon">✉</span>
              <p>officialpetandfor@petand.com</p>
            </li>

            <li>
              <span className="footer-contact-icon">☎</span>
              <p>02-1234-5689</p>
            </li>

            <li>
              <span className="footer-contact-icon">◷</span>
              <p>평일 09:00 - 18:00</p>
            </li>

            <li>
              <span className="footer-contact-icon">ⓘ</span>
              <p>주말/공휴일 휴무</p>
            </li>
          </ul>

          <div className="footer-social">
            <a href="#" aria-label="인스타그램">
              ◎
            </a>
            <a href="#" aria-label="카카오톡">
              ◉
            </a>
            <a href="#" aria-label="유튜브">
              ▶
            </a>
          </div>
        </section>
      </div>
    </footer>
  );
}
