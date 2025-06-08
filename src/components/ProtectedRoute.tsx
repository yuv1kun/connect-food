import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLoader from './PageLoader'; // Assuming you have a loader component

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading spinner or a blank page while checking auth state
    return <PageLoader loadingText="Authenticating..." />;
  }

  if (!user && !session) {
    // User is not authenticated, redirect to login page
    // Pass the current location to redirect back after login (optional)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the children
  // If children are provided, render them, otherwise render an <Outlet /> for nested routes.
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
