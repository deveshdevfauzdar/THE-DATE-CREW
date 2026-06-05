'use client';
// ============================================================
// Auth Context — Mock authentication for demo
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Matchmaker } from '@/types';
import { matchmakers } from '@/data/customers';

interface AuthContextType {
  user: Matchmaker | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'tdc_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Matchmaker | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verify it's still a valid matchmaker
        const valid = matchmakers.find(m => m.id === parsed.id);
        if (valid) setUser(valid);
      }
    } catch {
      // Invalid stored data, ignore
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    const matchmaker = matchmakers.find(
      m => m.email.toLowerCase() === email.toLowerCase() && m.password === password
    );

    if (matchmaker) {
      setUser(matchmaker);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchmaker));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password. Please try again.' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
