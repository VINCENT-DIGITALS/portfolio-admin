'use client';

import { useState } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import { Field, Input, Textarea } from '@/components/Field';

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
      <h2 className="text-lg font-semibold">Send a message</h2>

      {status === 'success' && (
        <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
          Thanks! Your message has been sent.
        </div>
      )}
      {status === 'error' && error && (
        <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <Field label="Name" error={fieldErrors.name?.[0]}>
        <Input value={form.name} onChange={onChange('name')} required maxLength={120} />
      </Field>
      <Field label="Email" error={fieldErrors.email?.[0]}>
        <Input type="email" value={form.email} onChange={onChange('email')} required maxLength={200} />
      </Field>
      <Field label="Subject" error={fieldErrors.subject?.[0]}>
        <Input value={form.subject} onChange={onChange('subject')} maxLength={200} />
      </Field>
      <Field label="Message" error={fieldErrors.message?.[0]}>
        <Textarea value={form.message} onChange={onChange('message')} required minLength={3} maxLength={5000} />
      </Field>

      <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
