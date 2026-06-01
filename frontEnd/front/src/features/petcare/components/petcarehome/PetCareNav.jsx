import Nav from "../../../../shared/layouts/nav/Nav";

const leftMenus = [
  { label: "건강관리 홈", path: "/healthcare", end: true },
  { label: "건강 진단", path: "/healthcare/requesthome" },
  { label: "펫 보험", path: "/healthcare/" },
  { label: "일정", path: "/healthcare/schedule" },
];

export default function PetCareNav() {
  return <Nav leftMenus={leftMenus} />;
}
