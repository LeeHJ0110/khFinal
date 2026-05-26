import { Link } from "react-router-dom";

/**
 * Nav 안에서 메뉴 하나를 출력하는 컴포넌트
 *
 * menu 객체 예시:
 * {
 *   label: "스토어홈",
 *   path: "/store",
 *   icon: null,
 *   count: 3
 * }
 *
 * label: 화면에 보이는 메뉴명
 * path: 이동할 주소
 * icon: 메뉴 앞에 넣을 이미지 아이콘, 없으면 생략 가능
 * count: 장바구니 수량처럼 숫자를 표시할 때 사용, 없으면 생략 가능
 */
export default function NavItem({ menu, isActive = false }) {
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={menu.path}>
        {menu.icon && (
          <span className="common-nav-icon">
            <img src={menu.icon} alt="" />
          </span>
        )}

        <span>{menu.label}</span>

        {menu.count !== undefined && menu.count !== null && (
          <span className="common-nav-count">{menu.count}</span>
        )}
      </Link>
    </li>
  );
}
