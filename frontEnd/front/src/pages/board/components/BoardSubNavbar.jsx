import ReactDOM from "react-dom";
import styled from "styled-components";

export default function BoardSubNavbar({ activeTab, onTabChange, bypassPortal }) {
  const menuItems = [
    { key: "HOME", label: "커뮤니티홈" },
    { key: "FREE", label: "자유게시판" },
    { key: "PRODUCT_REVIEW", label: "상품후기게시판" },
    { key: "FAC_REVIEW", label: "시설후기게시판" },
    { key: "FAQ", label: "FAQ게시판" },
    { key: "NEWS", label: "뉴스게시판" },
  ];

  const content = (
    <SubNavbar>
      <SubNavInner>
        {menuItems.map((item) => (
          <SubNavItem
            key={item.key}
            $active={activeTab === item.key}
            onClick={() => {
              onTabChange(item.key);
            }}
          >
            {item.label}
          </SubNavItem>
        ))}
      </SubNavInner>
    </SubNavbar>
  );

  const portalRoot = !bypassPortal ? document.getElementById("board-subnavbar-portal") : null;
  if (portalRoot) {
    return ReactDOM.createPortal(content, portalRoot);
  }

  return content;
}

const SubNavbar = styled.div`
  width: 100%;
  height: 40px;
  background-color: #ffffff;
  border-bottom: 1px solid var(--color-bg-soft);
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

const SubNavInner = styled.div`
  width: 100%;
  max-width: var(--layout-max-width);
  height: 100%;
  margin: 0 auto;
  padding: 0 var(--layout-padding-x);
  display: flex;
  align-items: center;
  gap: 32px;
`;

const SubNavItem = styled.button`
  height: 100%;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: ${(props) => (props.$active ? "800" : "600")};
  color: ${(props) => (props.$active ? "var(--color-main)" : "#555555")};
  position: relative;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-main);
  }

  ${(props) =>
    props.$active &&
    `
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--color-main);
      border-radius: 3px 3px 0 0;
    }
  `}
`;
