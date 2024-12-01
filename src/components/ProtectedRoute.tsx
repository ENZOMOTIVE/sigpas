import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

type Role = 'student' | 'issuer' | 'validator';

interface ProtectedRouteProps {
  component: React.ComponentType;
  allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, allowedRoles }) => {
  const { account, role } = useWallet();

  if (!account) {
    return <Navigate to="/" replace />;
  }

  if (role && allowedRoles.includes(role as Role)) {
    return <Component />;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;

