'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  merchantId?: string;
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
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        // Verify token with public API (no auth required)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/v1/request/modules/merchants/public_verify.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'SUCCESS') {
            setUser(data.data);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            setUser(null);
          }
        } else {
          // Clear storage on network error
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
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
        const { user, token, session } = data.data;

        // Store JWT auth data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));

        // Store session credentials for callApi compatibility
        if (session) {
          localStorage.setItem('auth_user_id', session.user_id);
          localStorage.setItem('auth_session_secret', session.session_secret);
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

      // Use the public login endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/v1/request/modules/merchants/public_login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        const { user, token } = data.data;

        // Store auth data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));

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
    // Clear JWT auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');

    // Clear session credentials for callApi
    localStorage.removeItem('auth_user_id');
    localStorage.removeItem('auth_session_secret');
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
  return context;
}