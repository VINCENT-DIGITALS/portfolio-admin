'use client';

import { useState } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import { Field, Input, Textarea } from '@/components/Field';
import { Spinner } from '@/components/Loading';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting'); setError(null); setFieldErrors({});
    try {
      await apiClient.post('/api/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      if (err instanceof ApiError) {
        setError(err.message);
        const data = err.data as { errors?: Record<string, string[]> } | undefined;
        if (data?.errors) setFieldErrors(data.errors);
      } else {
        setError('Failed to send message.');
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="card" noValidate>
      <h2 className="text-lg font-semibold tracking-tight">Send a message</h2>
      <p className="mt-1 text-xs muted-2">Replies usually within 1–3 days.</p>

      {status === 'success' && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
          Thanks! Your message has been sent.
        </div>
      )}
      {status === 'error' && error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Field label="Name" error={fieldErrors.name?.[0]}>
          <Input value={form.name} onChange={onChange('name')} required maxLength={120} autoComplete="name" />
        </Field>
        <Field label="Email" error={fieldErrors.email?.[0]}>
          <Input type="email" value={form.email} onChange={onChange('email')} required maxLength={200} autoComplete="email" />
        </Field>
      </div>
      <Field label="Subject" error={fieldErrors.subject?.[0]}>
        <Input value={form.subject} onChange={onChange('subject')} maxLength={200} />
      </Field>
      <Field label="Message" error={fieldErrors.message?.[0]}>
        <Textarea value={form.message} onChange={onChange('message')} required minLength={3} maxLength={5000} />
      </Field>

      <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
        {status === 'submitting' && <Spinner />}
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
