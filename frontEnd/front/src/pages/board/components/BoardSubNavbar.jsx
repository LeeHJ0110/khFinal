import ReactDOM from "react-dom";
import "../../../shared/layouts/nav/Nav.css";
export default function BoardSubNavbar({
  activeTab,
  onTabChange,
  bypassPortal,
}) {
  const menuItems = [
    { key: "HOME", label: "커뮤니티홈" },
    { key: "FREE", label: "자유게시판" },
    { key: "PRODUCT_REVIEW", label: "상품후기게시판" },
    { key: "FAC_REVIEW", label: "시설후기게시판" },
    { key: "FAQ", label: "FAQ게시판" },
    { key: "NEWS", label: "뉴스게시판" },
  ];
  const content = (
    <nav className="common-nav">
      <div className="common-nav-inner">
        <ul className="common-nav-left">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={activeTab === item.key ? "active" : ""}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onTabChange(item.key);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
  const portalRoot = !bypassPortal
    ? document.getElementById("board-subnavbar-portal")
    : null;
  if (portalRoot) {
    return ReactDOM.createPortal(content, portalRoot);
  }
  return content;
}
