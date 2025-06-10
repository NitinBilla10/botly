'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginWithPassword, registerWithPassword, getCurrentUser } from '@/lib/api';

interface User {
  id: number;
  email: string;
  openai_api_key: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, openaiApiKey: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    // Ensure we're in the browser before accessing localStorage
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('access_token');
    console.log('AuthContext: Checking for stored token on page load:', !!token);
    
    if (token) {
      console.log('AuthContext: Token found, validating with backend...');
      // Verify token and get user data
      getCurrentUser()
        .then((userData) => {
          console.log('AuthContext: Token validation successful, user logged in:', userData.email);
          setUser(userData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('AuthContext: Token validation failed:', error);
          // Only clear token if it's definitely invalid (401/403 errors)
          const status = error.status || error.response?.status;
          if (status === 401 || status === 403) {
            console.log('AuthContext: Clearing invalid token');
            localStorage.removeItem('access_token');
            setUser(null);
          } else {
            console.log('AuthContext: Network error, keeping token for retry');
            // For network errors, we'll keep the user logged out but preserve the token
            // They can try refreshing or the token refresh timer will retry
          }
          setIsLoading(false);
        });
    } else {
      console.log('AuthContext: No token found, user needs to login');
      setIsLoading(false);
    }
  }, []); // Remove user dependency to prevent infinite loops

  // Separate useEffect for token refresh
  useEffect(() => {
    if (!user || typeof window === 'undefined') return; // Only set up refresh if user is logged in and we're in browser

    // Set up token refresh timer (check every hour)
    const refreshInterval = setInterval(() => {
      const currentToken = localStorage.getItem('access_token');
      if (currentToken) {
        // Check token validity
        getCurrentUser().catch(() => {
          // Token expired, log out user
          logout();
        });
      }
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(refreshInterval);
  }, [user?.id]); // Only depend on user.id to avoid unnecessary refreshes

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Login with email and password
      const authResponse = await loginWithPassword(email, password);
      
      // Store the access token
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', authResponse.access_token);
      }
      
      // Get user data
      const userData = await getCurrentUser();
      setUser(userData);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, openaiApiKey: string) => {
    try {
      setIsLoading(true);
      
      // Register new user
      const userData = await registerWithPassword(email, password, openaiApiKey);
      
      // After registration, login to get the token
      const authResponse = await loginWithPassword(email, password);
      
      // Store the access token
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', authResponse.access_token);
      }
      
      // Set user data
      setUser(userData);
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoading(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
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