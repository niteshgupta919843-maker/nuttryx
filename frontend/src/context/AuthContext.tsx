'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role?: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';
  authPromptMessage: string;
  setAuthMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register', prompt?: string, onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; message: string }>;
  register: (data: { name: string; email: string; phone: string; password?: string }) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  requireAuth: (callback: () => void, prompt?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authPromptMessage, setAuthPromptMessage] = useState('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Restore session from localStorage on mount & verify with backend
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('nuttryx_user');
      const savedToken = localStorage.getItem('nuttryx_auth_token');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (savedToken) setToken(savedToken);

        // Background sync latest profile from database
        fetch(`/api/auth/me?userId=${parsed.id}`, { cache: 'no-store' })
          .then(res => res.json())
          .then(json => {
            if (json.success && json.data) {
              setUser(json.data);
              localStorage.setItem('nuttryx_user', JSON.stringify(json.data));
            }
          })
          .catch(() => {});
      }
    } catch {
      // ignore
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  const openAuthModal = (
    mode: 'login' | 'register' = 'login', 
    prompt = '', 
    onSuccess?: () => void
  ) => {
    setAuthMode(mode);
    setAuthPromptMessage(prompt);
    if (onSuccess) {
      setPendingAction(() => onSuccess);
    }
    // Directly navigate to full dedicated login / register page (no popup modal)
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/login?mode=${mode}&redirect=${encodeURIComponent(currentPath)}`;
      return;
    }
    setIsAuthModalOpen(false);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthPromptMessage('');
    setPendingAction(null);
  };

  const executePendingAction = () => {
    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      setTimeout(() => {
        action();
      }, 100);
    }
  };

  const login = async (identifier: string, password?: string) => {
    try {
      let res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password })
      });

      if (!res.ok) {
        res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: identifier.trim(), password })
        });
      }

      const json = await res.json();
      if (json.success && json.data) {
        setUser(json.data);
        setToken(json.token || null);
        localStorage.setItem('nuttryx_user', JSON.stringify(json.data));
        if (json.token) localStorage.setItem('nuttryx_auth_token', json.token);
        setIsAuthModalOpen(false);
        executePendingAction();
        return { success: true, message: json.message || `Welcome back, ${json.data.name}!` };
      } else {
        return { success: false, message: json.message || 'Login failed' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Could not connect to authentication server.' };
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password?: string }) => {
    try {
      let res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }

      const json = await res.json();
      if (json.success && json.data) {
        setUser(json.data);
        setToken(json.token || null);
        localStorage.setItem('nuttryx_user', JSON.stringify(json.data));
        if (json.token) localStorage.setItem('nuttryx_auth_token', json.token);
        setIsAuthModalOpen(false);
        executePendingAction();
        return { success: true, message: json.message || `Account created! Welcome, ${json.data.name}.` };
      } else {
        return { success: false, message: json.message || 'Registration failed' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Could not connect to registration server.' };
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return { success: false, message: 'You must be signed in.' };
    try {
      let res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...data })
      });

      if (!res.ok) {
        res = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id, ...data })
        });
      }

      const json = await res.json();
      if (json.success && json.data) {
        setUser(json.data);
        localStorage.setItem('nuttryx_user', JSON.stringify(json.data));
        return { success: true, message: 'Profile updated in database successfully!' };
      }
      return { success: false, message: json.message || 'Update failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Server connection error.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nuttryx_user');
    localStorage.removeItem('nuttryx_auth_token');
  };

  const requireAuth = (callback: () => void, prompt = 'Please sign in or create an account to proceed.') => {
    if (user) {
      callback();
    } else {
      openAuthModal('login', prompt, callback);
    }
  };

  const contextValue = React.useMemo(() => ({
    user,
    token,
    isAuthenticated: !!user,
    isAuthReady,
    isAuthModalOpen,
    authMode,
    authPromptMessage,
    setAuthMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    updateProfile,
    logout,
    requireAuth
  }), [
    user,
    token,
    isAuthReady,
    isAuthModalOpen,
    authMode,
    authPromptMessage
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
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
