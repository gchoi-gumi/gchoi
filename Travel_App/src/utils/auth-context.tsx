import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectId, publicAnonKey } from './supabase/info';
import { createClient } from '@supabase/supabase-js';

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
  isLoading: true,
  signUp: async () => ({ success: false, error: 'Auth not initialized' }),
  signIn: async () => ({ success: false, error: 'Auth not initialized' }),
  signOut: async () => {},
  refreshUser: async () => {},
});

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a8dd3f70`;

// Create Supabase client for direct auth
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('[AuthProvider] Rendering with user:', user?.email || 'not logged in');

  // Load user from localStorage on mount
  useEffect(() => {
    console.log('[AuthProvider] Initializing...');
    try {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify token is still valid
        verifyToken(storedToken);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('[AuthProvider] Error loading from localStorage:', error);
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
      
      if (authUser && !error) {
        const userData = {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Token invalid, clear everything
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setAccessToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('[AuthProvider] Token verification error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setAccessToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('[AuthProvider] Sign up request (direct Supabase):', { email, name });
      
      // Sign up using Supabase client directly
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: undefined, // Disable email confirmation for testing
        }
      });

      if (error) {
        console.error('[AuthProvider] Supabase sign up error:', error);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        console.error('[AuthProvider] No user returned from sign up');
        return { success: false, error: 'Sign up failed - no user returned' };
      }

      console.log('[AuthProvider] Sign up successful!');

      // Sign in immediately after sign up
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signInData.session) {
        console.error('[AuthProvider] Auto sign in after signup failed:', signInError);
        return { success: false, error: 'Account created but auto-login failed. Please sign in manually.' };
      }

      const userData = {
        id: signInData.user.id,
        email: signInData.user.email || email,
        name: name
      };

      setUser(userData);
      setAccessToken(signInData.session.access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', signInData.session.access_token);

      return { success: true };
    } catch (error) {
      console.error('[AuthProvider] Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      return { success: false, error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[AuthProvider] Sign in request (direct Supabase):', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[AuthProvider] Supabase sign in error:', error);
        return { success: false, error: error.message };
      }

      if (!data.session) {
        console.error('[AuthProvider] No session returned after sign in');
        return { success: false, error: 'No session created' };
      }

      console.log('[AuthProvider] Sign in successful!');

      const userData = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || email.split('@')[0]
      };

      setUser(userData);
      setAccessToken(data.session.access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', data.session.access_token);

      return { success: true };
    } catch (error) {
      console.error('[AuthProvider] Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      console.log('[AuthProvider] Sign out');
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error('[AuthProvider] Sign out error:', error);
    }
  };

  const refreshUser = async () => {
    if (accessToken) {
      await verifyToken(accessToken);
    }
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