import ReactDOM from "react-dom";
import styled from "styled-components";

export default function BoardSubNavbar({ activeTab, onTabChange }) {
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

  const portalRoot = document.getElementById("board-subnavbar-portal");
  if (portalRoot) {
    return ReactDOM.createPortal(content, portalRoot);
  }

  return content;
}

const SubNavbar = styled.div`
  width: 100%;
  height: 48px;
  background-color: #ffffff;
  border-bottom: 1px solid #eef1f2;
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

const SubNavInner = styled.div`
  width: var(--layout-width);
  max-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 0 var(--layout-padding-x);
`;

const SubNavItem = styled.button`
  height: 100%;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "700" : "500")};
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
