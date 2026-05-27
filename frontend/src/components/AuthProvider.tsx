'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AUTH_EXPIRED_EVENT, apiClient, ApiError, clearAuthToken, getAuthToken, setAuthToken } from '@/lib/api';
import type { User } from '@/lib/types';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    if (!getAuthToken()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.get<{ user: User | null }>('/api/admin/user');
      setUser(res.user ?? null);
    } catch {
      clearAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const onAuthExpired = () => {
      setUser(null);
      setLoading(false);
      if (pathname !== '/admin/login') router.replace('/admin/login');
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, onAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onAuthExpired);
  }, [pathname, router]);

  useEffect(() => {
    if (pathname === '/admin/login') return;

    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };

    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [pathname, refresh]);

  // Redirect to login when not authenticated and not already on login page.
  useEffect(() => {
    if (loading) return;
    const isLogin = pathname === '/admin/login';
    if (!user && !isLogin) router.replace('/admin/login');
    if (user && isLogin) router.replace('/admin/dashboard');
  }, [loading, user, pathname, router]);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post<{ token: string; user: User }>('/api/admin/login', { email, password }, { auth: 'none' });
    setAuthToken(res.token);
    setUser(res.user);
  };

  const logout = async () => {
    try { await apiClient.post('/api/admin/logout'); }
    catch (e) { if (!(e instanceof ApiError)) throw e; }
    clearAuthToken();
    setUser(null);
    router.replace('/admin/login');
  };

  return <Ctx.Provider value={{ user, loading, login, logout, refresh }}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
}
