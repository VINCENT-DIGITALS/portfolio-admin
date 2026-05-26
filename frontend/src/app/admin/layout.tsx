'use client';

import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { AdminShell } from '@/components/admin/AdminShell';
import { PageLoading } from '@/components/Loading';
import { usePathname } from 'next/navigation';

function Inner({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (loading) return <PageLoading />;
  if (isLogin) return <>{children}</>;
  if (!user) return <PageLoading label="Redirecting…" />;

  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Inner>{children}</Inner>
    </AuthProvider>
  );
}
