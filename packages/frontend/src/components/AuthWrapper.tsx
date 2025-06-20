import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface AuthWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthWrapper({
  children,
  requireAuth = true,
  redirectTo = '/login',
}: AuthWrapperProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    navigate(redirectTo);
    return null;
  }

  // Render children if authentication requirements are met
  return <>{children}</>;
}
