'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '@/lib/api';
import { Field, Input, Textarea } from '@/components/Field';
import { Spinner } from '@/components/Loading';
import type { Blog } from '@/lib/types';

type FormValues = Partial<Blog> & { tags_input?: string };

export function BlogForm({ initial, mode }: { initial?: Blog; mode: 'create' | 'edit' }) {
  const router = useRouter();
  const [form, setForm] = useState<FormValues>({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    excerpt: initial?.excerpt ?? '',
    content: initial?.content ?? '',
    cover_image_url: initial?.cover_image_url ?? '',
    is_published: initial?.is_published ?? false,
    published_at: initial?.published_at ?? '',
    tags_input: (initial?.tags ?? []).join(', '),
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = <K extends keyof FormValues>(k: K, v: FormValues[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setServerError(null); setErrors({});
    const payload = {
      ...form,
      tags: (form.tags_input ?? '').split(',').map((s) => s.trim()).filter(Boolean),
      published_at: form.published_at || null,
    };
    delete (payload as Record<string, unknown>).tags_input;

    try {
      if (mode === 'create') await apiClient.post('/api/admin/blogs', payload);
      else if (initial) await apiClient.put(`/api/admin/blogs/${initial.id}`, payload);
      router.push('/admin/blogs');
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
        const data = err.data as { errors?: Record<string, string[]> } | undefined;
        if (data?.errors) setErrors(data.errors);
      }
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          {serverError}
        </div>
      )}

      <section className="card">
        <h2 className="text-base font-semibold tracking-tight">Article</h2>
        <Field label="Title" error={errors.title?.[0]} className="mt-4">
          <Input value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} required />
        </Field>
        <Field label="Slug" error={errors.slug?.[0]} hint="Auto-generated if blank.">
          <Input value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value)} />
        </Field>
        <Field label="Excerpt"><Textarea value={form.excerpt ?? ''} onChange={(e) => set('excerpt', e.target.value)} /></Field>
        <Field label="Content" hint="Plain text or Markdown.">
          <Textarea rows={16} value={form.content ?? ''} onChange={(e) => set('content', e.target.value)} />
        </Field>
      </section>

      <section className="card">
        <h2 className="text-base font-semibold tracking-tight">Metadata</h2>
        <Field label="Cover image URL" error={errors.cover_image_url?.[0]} className="mt-4">
          <Input type="url" value={form.cover_image_url ?? ''} onChange={(e) => set('cover_image_url', e.target.value)} />
        </Field>
        <Field label="Tags" hint="Comma separated">
          <Input value={form.tags_input ?? ''} onChange={(e) => set('tags_input', e.target.value)} placeholder="laravel, nextjs" />
        </Field>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" checked={!!form.is_published} onChange={(e) => set('is_published', e.target.checked)} />
            <span>Published</span>
          </label>
          <Field label="Publish date" className="mb-0">
            <Input type="datetime-local" value={form.published_at?.slice(0, 16) ?? ''} onChange={(e) => set('published_at', e.target.value)} />
          </Field>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" disabled={busy}>
          {busy && <Spinner />}
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => router.back()}>Cancel</button>
      </div>
    </form>
  );
}
