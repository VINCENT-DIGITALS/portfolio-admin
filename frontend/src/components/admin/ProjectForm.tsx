'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '@/lib/api';
import { Field, Input, Textarea, Select } from '@/components/Field';
import type { Project } from '@/lib/types';

type FormValues = Partial<Project> & { tech_stack_input?: string };

export function ProjectForm({ initial, mode }: { initial?: Project; mode: 'create' | 'edit' }) {
  const router = useRouter();
  const [form, setForm] = useState<FormValues>({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    short_description: initial?.short_description ?? '',
    full_description: initial?.full_description ?? '',
    category: initial?.category ?? '',
    status: initial?.status ?? 'completed',
    role: initial?.role ?? '',
    start_date: initial?.start_date ?? '',
    end_date: initial?.end_date ?? '',
    github_url: initial?.github_url ?? '',
    live_demo_url: initial?.live_demo_url ?? '',
    featured_image_url: initial?.featured_image_url ?? '',
    is_featured: initial?.is_featured ?? false,
    is_published: initial?.is_published ?? true,
    sort_order: initial?.sort_order ?? 0,
    tech_stack_input: (initial?.tech_stack ?? []).join(', '),
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
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      tech_stack: (form.tech_stack_input ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    };
    delete (payload as Record<string, unknown>).tech_stack_input;

    try {
      if (mode === 'create') {
        await apiClient.post('/api/admin/projects', payload);
      } else if (initial) {
        await apiClient.put(`/api/admin/projects/${initial.id}`, payload);
      }
      router.push('/admin/projects');
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

      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <Field label="Title" error={errors.title?.[0]}>
          <Input value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} required />
        </Field>
        <Field label="Slug (optional)" error={errors.slug?.[0]} hint="Auto-generated if blank.">
          <Input value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value)} />
        </Field>
      </div>

      <Field label="Short description" error={errors.short_description?.[0]}>
        <Textarea value={form.short_description ?? ''} onChange={(e) => set('short_description', e.target.value)} />
      </Field>

      <Field label="Full description" error={errors.full_description?.[0]}>
        <Textarea rows={8} value={form.full_description ?? ''} onChange={(e) => set('full_description', e.target.value)} />
      </Field>

      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
        <Field label="Category">
          <Input value={form.category ?? ''} onChange={(e) => set('category', e.target.value)} />
        </Field>
        <Field label="Status">
          <Select value={form.status ?? ''} onChange={(e) => set('status', e.target.value)}>
            <option value="completed">Completed</option>
            <option value="in-progress">In progress</option>
            <option value="paused">Paused</option>
          </Select>
        </Field>
        <Field label="Role">
          <Input value={form.role ?? ''} onChange={(e) => set('role', e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <Field label="Start date"><Input type="date" value={form.start_date ?? ''} onChange={(e) => set('start_date', e.target.value)} /></Field>
        <Field label="End date"><Input type="date" value={form.end_date ?? ''} onChange={(e) => set('end_date', e.target.value)} /></Field>
      </div>

      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <Field label="GitHub URL" error={errors.github_url?.[0]}><Input type="url" value={form.github_url ?? ''} onChange={(e) => set('github_url', e.target.value)} /></Field>
        <Field label="Live demo URL" error={errors.live_demo_url?.[0]}><Input type="url" value={form.live_demo_url ?? ''} onChange={(e) => set('live_demo_url', e.target.value)} /></Field>
      </div>

      <Field label="Featured image URL" error={errors.featured_image_url?.[0]}>
        <Input type="url" value={form.featured_image_url ?? ''} onChange={(e) => set('featured_image_url', e.target.value)} placeholder="Paste from Media library or Supabase Storage" />
      </Field>

      <Field label="Tech stack (comma separated)">
        <Input value={form.tech_stack_input ?? ''} onChange={(e) => set('tech_stack_input', e.target.value)} placeholder="Next.js, Laravel, Postgres" />
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.is_published} onChange={(e) => set('is_published', e.target.checked)} /> Published
        </label>
        <Field label="Sort order"><Input type="number" value={form.sort_order ?? 0} onChange={(e) => set('sort_order', Number(e.target.value))} /></Field>
      </div>

      <div className="mt-4 flex gap-2">
        <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save project'}</button>
        <button type="button" className="btn-secondary" onClick={() => router.back()}>Cancel</button>
      </div>
    </form>
  );
}
