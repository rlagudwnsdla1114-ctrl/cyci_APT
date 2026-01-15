import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * allow: ["jobseeker"] 또는 ["company"] 또는 ["jobseeker","company"]
 * - 토큰 없으면 /login으로
 * - 역할 다르면 /select로
 */
export default function ProtectedRoute({ allow }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole"); // Login.jsx에서 role 저장한 값: "jobseeker" | "company"
  const loc = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  if (Array.isArray(allow) && allow.length > 0 && !allow.includes(role)) {
    return <Navigate to="/select" replace />;
  }

  return <Outlet />;
}
