'use client';

import { useEffect, useState } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import type { Profile } from '@/lib/types';
import { Field, Input, Textarea } from '@/components/Field';
import { PageLoading, ErrorState, Spinner } from '@/components/Loading';
import { PageHeader } from '@/components/admin/Breadcrumbs';
import { AvatarUpload } from '@/components/admin/AvatarUpload';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient.get<{ data: Profile }>('/api/admin/profile')
      .then((r) => setProfile(r.data))
      .catch((e) => setError(e?.message ?? 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setProfile((p) => p ? { ...p, [k]: v } : p);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setBusy(true); setErrors({}); setSavedAt(null);
    try {
      const r = await apiClient.put<{ data: Profile }>('/api/admin/profile', profile);
      setProfile(r.data);
      setSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      if (err instanceof ApiError) {
        const data = err.data as { errors?: Record<string, string[]> } | undefined;
        if (data?.errors) setErrors(data.errors);
        setError(err.message);
      }
    } finally { setBusy(false); }
  }

  if (loading) return <PageLoading />;
  if (error && !profile) return <ErrorState message={error} />;
  if (!profile) return null;

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Profile' }]}
        title="Profile"
        subtitle="Public information shown on the portfolio."
      />

      <form onSubmit={onSubmit} className="card max-w-3xl">
        {savedAt && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
            Saved at {savedAt}.
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">{error}</div>
        )}

        <AvatarUpload
          value={profile.profile_image_url ?? null}
          onChange={(url) => set('profile_image_url', url)}
          hint="Uploaded to your Supabase Storage bucket under /profile."
        />

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Field label="Full name" error={errors.full_name?.[0]}><Input value={profile.full_name} onChange={(e) => set('full_name', e.target.value)} required /></Field>
          <Field label="Title"><Input value={profile.title ?? ''} onChange={(e) => set('title', e.target.value)} /></Field>
        </div>
        <Field label="Bio"><Textarea rows={6} value={profile.bio ?? ''} onChange={(e) => set('bio', e.target.value)} /></Field>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Field label="Location"><Input value={profile.location ?? ''} onChange={(e) => set('location', e.target.value)} /></Field>
          <Field label="Email" error={errors.email?.[0]}><Input type="email" value={profile.email ?? ''} onChange={(e) => set('email', e.target.value)} /></Field>
          <Field label="Phone"><Input value={profile.phone ?? ''} onChange={(e) => set('phone', e.target.value)} /></Field>
          <Field label="Resume URL" error={errors.resume_url?.[0]}><Input type="url" value={profile.resume_url ?? ''} onChange={(e) => set('resume_url', e.target.value)} /></Field>
          <Field label="GitHub URL" error={errors.github_url?.[0]}><Input type="url" value={profile.github_url ?? ''} onChange={(e) => set('github_url', e.target.value)} /></Field>
          <Field label="LinkedIn URL" error={errors.linkedin_url?.[0]}><Input type="url" value={profile.linkedin_url ?? ''} onChange={(e) => set('linkedin_url', e.target.value)} /></Field>
          <Field label="Facebook URL" error={errors.facebook_url?.[0]}><Input type="url" value={profile.facebook_url ?? ''} onChange={(e) => set('facebook_url', e.target.value)} /></Field>
          <Field label="Portfolio URL" error={errors.portfolio_url?.[0]}><Input type="url" value={profile.portfolio_url ?? ''} onChange={(e) => set('portfolio_url', e.target.value)} /></Field>
        </div>

        <button className="btn-primary" disabled={busy}>
          {busy && <Spinner />}
          {busy ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
