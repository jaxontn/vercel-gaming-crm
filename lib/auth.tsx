'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  // Support both camelCase (frontend) and snake_case (backend) conventions
  merchantId?: string;
  merchant_id?: string;
  role?: string;
  businessName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginPublic: (email: string, password: string) => Promise<void>;
  registerMerchant: (businessName: string, contactName: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = sessionStorage.getItem('user_data');
      const sessionSecret = sessionStorage.getItem('session_secret');
      const userId = sessionStorage.getItem('id');

      if (userData && sessionSecret && userId) {
        // Verify session using authenticate.php
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/authenticate.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'verify_session',
            user_id: userId,
            session_secret: sessionSecret
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'SUCCESS') {
            // Use the stored user data since we're just verifying the session
            const user = JSON.parse(userData);
            setUser(user);
          } else {
            // Session invalid, clear storage
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('user_data');
            sessionStorage.removeItem('id');
            sessionStorage.removeItem('session_secret');
            setUser(null);
          }
        } else {
          // Clear storage on network error
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('user_data');
          sessionStorage.removeItem('id');
          sessionStorage.removeItem('session_secret');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear storage on error
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user_data');
      sessionStorage.removeItem('id');
      sessionStorage.removeItem('session_secret');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Use the v1 authenticate endpoint that routes to merchants authentication
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/authenticate.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email,
          password
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        const { user, session } = data.data;

        // Store all auth data in sessionStorage only
        sessionStorage.setItem('user_data', JSON.stringify(user));

        // Store session credentials for callApi compatibility
        if (session) {
          sessionStorage.setItem('id', session.user_id);
          sessionStorage.setItem('session_secret', session.session_secret);
        }

        setUser(user);
        setIsLoading(false);

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const loginPublic = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Use the public login endpoint via authenticate.php
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/authenticate.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email,
          password
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        const { user, session } = data.data;

        // Store auth data in sessionStorage
        sessionStorage.setItem('user_data', JSON.stringify(user));

        // Store session credentials for callApi compatibility
        if (session) {
          sessionStorage.setItem('id', session.user_id);
          sessionStorage.setItem('session_secret', session.session_secret);
        }

        setUser(user);
        setIsLoading(false);

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    // Clear all auth data from sessionStorage
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_data');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('session_secret');

    setUser(null);
    router.push('/login');
  };

  const registerMerchant = async (businessName: string, contactName: string, email: string, phone: string, password: string) => {
    try {
      setIsLoading(true);

      // Use the v1 authenticate endpoint for registration
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/authenticate.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          business_name: businessName,
          contact_name: contactName,
          email,
          phone,
          password
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();

      if (data.status !== 'SUCCESS') {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginPublic, registerMerchant, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Add helper to get merchant ID regardless of field naming convention
  // Use useCallback to make it stable
  const getMerchantId = useCallback(() => {
    if (!context.user) return null;
    return context.user.merchantId || context.user.merchant_id || null;
  }, [context.user]);

  return {
    ...context,
    getMerchantId
  };
}