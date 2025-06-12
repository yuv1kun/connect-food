import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface Props {
  children: JSX.Element;
  role?: string;
}

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.user_metadata?.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
