'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '@/lib/api';
import { Field, Input, Textarea } from '@/components/Field';
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
    <form onSubmit={onSubmit} className="card max-w-3xl">
      {serverError && <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{serverError}</div>}

      <Field label="Title" error={errors.title?.[0]}>
        <Input value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} required />
      </Field>
      <Field label="Slug (optional)" error={errors.slug?.[0]}>
        <Input value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value)} />
      </Field>
      <Field label="Excerpt"><Textarea value={form.excerpt ?? ''} onChange={(e) => set('excerpt', e.target.value)} /></Field>
      <Field label="Content (Markdown supported)">
        <Textarea rows={16} value={form.content ?? ''} onChange={(e) => set('content', e.target.value)} />
      </Field>
      <Field label="Cover image URL" error={errors.cover_image_url?.[0]}>
        <Input type="url" value={form.cover_image_url ?? ''} onChange={(e) => set('cover_image_url', e.target.value)} />
      </Field>
      <Field label="Tags (comma separated)">
        <Input value={form.tags_input ?? ''} onChange={(e) => set('tags_input', e.target.value)} placeholder="laravel, nextjs" />
      </Field>
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.is_published} onChange={(e) => set('is_published', e.target.checked)} /> Published
        </label>
        <Field label="Publish date (optional)">
          <Input type="datetime-local" value={form.published_at?.slice(0, 16) ?? ''} onChange={(e) => set('published_at', e.target.value)} />
        </Field>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        <button type="button" className="btn-secondary" onClick={() => router.back()}>Cancel</button>
      </div>
    </form>
  );
}
