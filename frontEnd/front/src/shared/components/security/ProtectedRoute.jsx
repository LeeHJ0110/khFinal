import { Navigate, useLocation } from "react-router-dom";

/**
 * 로그인 인증 여부를 판단하여 비인증 유저를 로그인 페이지로 튕겨내는 가드 필터 컴포넌트
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("accessToken");

  if (!isAuthenticated) {
    alert("로그인 이후 이용해주세요");
    return <Navigate to="/member/login" state={{ from: location }} replace />;
  }
  return children;
}
