import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    // Logged in but wrong role
    return <Navigate to={userRole === 'admin' ? '/Admin-Dashboard' : '/Collector-Dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
