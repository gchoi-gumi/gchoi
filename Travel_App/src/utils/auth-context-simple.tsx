import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  isLoading: false,
  signUp: async () => ({ success: false, error: 'Not implemented' }),
  signIn: async () => ({ success: false, error: 'Not implemented' }),
  signOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('accessToken');
      
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    }
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Simple local authentication (no backend for now)
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
      };
      
      const mockToken = `mock_token_${Date.now()}`;
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('accessToken', mockToken);
      
      setUser(mockUser);
      setAccessToken(mockToken);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Sign up failed' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Simple local authentication (no backend for now)
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
      };
      
      const mockToken = `mock_token_${Date.now()}`;
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('accessToken', mockToken);
      
      setUser(mockUser);
      setAccessToken(mockToken);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Sign in failed' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    setUser(null);
    setAccessToken(null);
  };

  const refreshUser = async () => {
    // No-op for now
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        signUp,
        signIn,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
