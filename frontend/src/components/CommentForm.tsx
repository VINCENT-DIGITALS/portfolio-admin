'use client';

import { useState } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import { Field, Input, Textarea } from '@/components/Field';
import { Spinner } from '@/components/Loading';

interface Props {
  projectId?: number;
  title?: string;
  hint?: string;
}

export function CommentForm({ projectId, title = 'Leave a testimonial', hint }: Props) {
  const [form, setForm] = useState({ name: '', email: '', message: '', rating: 5 });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting'); setError(null); setFieldErrors({});
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        message: form.message,
        rating: form.rating || null,
      };
      if (form.email) payload.email = form.email;
      if (projectId) payload.project_id = projectId;

      await apiClient.post('/api/comments', payload);
      setStatus('success');
      setForm({ name: '', email: '', message: '', rating: 5 });
    } catch (err) {
      setStatus('error');
      if (err instanceof ApiError) {
        setError(err.message);
        const data = err.data as { errors?: Record<string, string[]> } | undefined;
        if (data?.errors) setFieldErrors(data.errors);
      } else {
        setError('Failed to submit. Please try again.');
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="card" noValidate>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {hint && <p className="mt-1 text-xs muted-2">{hint}</p>}

      {status === 'success' && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
          Thanks! Your comment is pending review and will appear once approved.
        </div>
      )}
      {status === 'error' && error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Field label="Name" error={fieldErrors.name?.[0]}>
          <Input value={form.name} onChange={(e) => set('name', e.target.value)} required maxLength={120} autoComplete="name" />
        </Field>
        <Field label="Email (optional)" error={fieldErrors.email?.[0]}>
          <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} maxLength={200} autoComplete="email" />
        </Field>
      </div>

      <Field label="Rating" error={fieldErrors.rating?.[0]}>
        <div className="flex gap-1 text-2xl" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={form.rating === n}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              onClick={() => set('rating', n)}
              className="leading-none transition hover:scale-110"
            >
              {n <= form.rating ? <span className="text-amber-500">★</span> : <span className="text-slate-300 dark:text-slate-600">★</span>}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Message" error={fieldErrors.message?.[0]}>
        <Textarea value={form.message} onChange={(e) => set('message', e.target.value)} required minLength={3} maxLength={2000} />
      </Field>

      <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
        {status === 'submitting' && <Spinner />}
        {status === 'submitting' ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  );
}
