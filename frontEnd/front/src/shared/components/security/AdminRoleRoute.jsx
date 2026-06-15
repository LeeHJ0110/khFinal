import { Navigate } from "react-router-dom";

function getRoleFromToken() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (e) {
    return null;
  }
}

export default function AdminRoleRoute({ allowedRoles, children }) {
  const role = getRoleFromToken();

  console.log("현재 role =", role);

  if (!role) {
    return <Navigate to="/member/login" replace />;
    alert("로그인 이후 이용해주세요");
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/common/error" replace />;
    alert("해당 권한이 없습니다");
  }

  return children;
}
