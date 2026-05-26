'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient, ApiError } from '@/lib/api';
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
    try {
      const res = await apiClient.get<{ user: User | null }>('/api/admin/user');
      setUser(res.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Redirect to login when not authenticated and not already on login page.
  useEffect(() => {
    if (loading) return;
    const isLogin = pathname === '/admin/login';
    if (!user && !isLogin) router.replace('/admin/login');
    if (user && isLogin) router.replace('/admin/dashboard');
  }, [loading, user, pathname, router]);

  const login = async (email: string, password: string) => {
    await apiClient.post('/api/admin/login', { email, password });
    await refresh();
  };

  const logout = async () => {
    try { await apiClient.post('/api/admin/logout'); }
    catch (e) { if (!(e instanceof ApiError)) throw e; }
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
