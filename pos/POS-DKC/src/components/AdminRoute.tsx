// components/AdminRoute.tsx

import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: any) => {
  const role = localStorage.getItem("POS-role");

  if (!role) return <Navigate to="/login" replace />;

  if (role !== "admin") return <Navigate to="/lock" replace />;

  return children;
};

export default AdminRoute;