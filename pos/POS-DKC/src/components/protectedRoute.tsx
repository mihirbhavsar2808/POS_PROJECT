// import { useSelector } from 'react-redux';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { useEffect, type ReactNode } from 'react';
// import type { RootState } from '../app/store';

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//     }
//   }, [isAuthenticated]);

//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;




import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("POS-token"); 

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;