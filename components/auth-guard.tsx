'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isApiAuthenticated } from '@/lib/api-client';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const hasToken = localStorage.getItem('auth_token');
      const hasUserData = localStorage.getItem('user_data');
      const hasSessionCredentials = isApiAuthenticated();

      // User is authenticated if they have both JWT token and session credentials
      const authenticated = hasToken && hasUserData && hasSessionCredentials;

      setIsAuthenticated(Boolean(authenticated));

      if (!authenticated) {
        // Clear any partial auth data
        if (!hasToken) {
          localStorage.removeItem('auth_user_id');
          localStorage.removeItem('auth_session_secret');
          sessionStorage.removeItem('id');
          sessionStorage.removeItem('session_secret');
        }

        // Redirect if not already on login page
        if (window.location.pathname !== redirectTo) {
          router.push(redirectTo);
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [router, redirectTo]);

  // Show loading or redirect if checking/not authenticated
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}