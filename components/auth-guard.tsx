'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isApiAuthenticated } from '@/lib/api-client';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean; // true = require auth to access, false = require NOT auth to access
}

export function AuthGuard({ children, redirectTo = '/login', requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const hasToken = sessionStorage.getItem('session_secret');
      const hasUserData = sessionStorage.getItem('user_data');
      const userId = sessionStorage.getItem('id');
      const sessionSecret = sessionStorage.getItem('session_secret');
      const hasSessionCredentials = isApiAuthenticated();

      
      // User is authenticated if they have JWT token and user data
      // Session credentials are optional for now (for callApi)
      const authenticated = hasToken && userId;

      setIsAuthenticated(Boolean(authenticated));

      // Handle authentication requirement
      if (requireAuth && !authenticated) {
        // This page REQUIRES authentication (like dashboard)
        // Clear any partial auth data only if no token exists
        if (!hasToken) {
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('user_data');
          sessionStorage.removeItem('id');
          sessionStorage.removeItem('session_secret');

          
        }

        // Redirect if not already on login page
        if (window.location.pathname !== redirectTo) {
          router.push(redirectTo);
        }

        
      } else if (!requireAuth && authenticated) {
        // This page REQUIRES user to NOT be authenticated (like login/register)
        // DON'T clear anything here - just redirect authenticated users to dashboard
        if (window.location.pathname !== '/dashboard') {
          router.push('/dashboard');
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [router, redirectTo, requireAuth]);

  // Show loading or redirect if checking
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

  // Render children based on authentication requirement
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect to login
  }

  if (!requireAuth && isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return <>{children}</>;
}