'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { Field, Input } from '@/components/Field';
import { Spinner } from '@/components/Loading';
import { ApiError } from '@/lib/api';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@portfolio.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_-10%,rgba(16,185,129,0.08),transparent_40%),radial-gradient(circle_at_80%_110%,rgba(16,185,129,0.06),transparent_40%)]" aria-hidden />
      <form onSubmit={onSubmit} className="card relative w-full max-w-sm !p-7">
        <Link href="/" className="group inline-flex items-center gap-2.5">
          <span aria-hidden className="inline-block h-2 w-2 shrink-0 rounded-full bg-brand-500 transition group-hover:bg-brand-600 dark:bg-brand-400 dark:group-hover:bg-brand-300" />
          <span className="text-[15px] font-semibold tracking-tight">Portfolio admin</span>
        </Link>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm muted-2">Manage your portfolio content.</p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="mt-5">
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </Field>
        </div>

        <button className="btn-primary w-full" disabled={busy}>
          {busy && <Spinner />}
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="mt-6 text-center text-xs muted-2">
          ← <Link href="/" className="hover:text-slate-900 dark:hover:text-white">Back to portfolio</Link>
        </p>
      </form>
    </div>
  );
}
