'use client';

import { useEffect, useRef, useState } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import type { MediaFile } from '@/lib/types';
import { PageLoading, ErrorState, EmptyState, Spinner } from '@/components/Loading';
import { ConfirmDelete } from '@/components/Modal';
import { Field, Input } from '@/components/Field';
import { PageHeader } from '@/components/admin/Breadcrumbs';

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [folder, setFolder] = useState('uploads');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true); setError(null);
    apiClient.get<{ data: MediaFile[] }>('/api/admin/media')
      .then((r) => setItems(r.data))
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setBusy(true); setUploadError(null);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    try {
      const r = await apiClient.post<{ data: MediaFile }>('/api/admin/media/upload', fd);
      setItems((arr) => [r.data, ...arr]);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : 'Upload failed.');
    } finally { setBusy(false); }
  }

  async function onDelete() {
    if (!deleteId) return;
    setBusy(true);
    try {
      await apiClient.delete(`/api/admin/media/${deleteId}`);
      setItems((arr) => arr.filter((x) => x.id !== deleteId));
      setDeleteId(null);
    } finally { setBusy(false); }
  }

  function copy(url: string, id: number) {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1500);
  }

  if (loading) return <PageLoading />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Media' }]}
        title="Media library"
        subtitle="Files uploaded here are stored in your Supabase bucket."
      />

      <form onSubmit={onUpload} className="card mb-6 max-w-2xl">
        {uploadError && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
            {uploadError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Field label="Folder">
            <Input value={folder} onChange={(e) => setFolder(e.target.value)} />
          </Field>
          <Field label="File">
            <input ref={fileRef} type="file" className="input file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-200 dark:hover:file:bg-slate-700" required />
          </Field>
        </div>
        <button className="btn-primary" disabled={busy}>
          {busy && <Spinner />}
          {busy ? 'Uploading…' : 'Upload to Supabase'}
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="No uploads yet" description="Drop your first image to get started." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((f) => (
            <div key={f.id} className="card !p-3 group">
              <div className="relative overflow-hidden rounded-md">
                {f.file_type?.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.file_url} alt={f.file_name} className="aspect-square w-full object-cover transition group-hover:scale-[1.02]" />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="mt-2 truncate text-xs font-medium" title={f.file_name}>{f.file_name}</p>
              <p className="text-[11px] muted-2 truncate">{f.file_type}</p>
              <div className="mt-2 flex gap-1.5">
                <button className="btn-secondary !h-7 !py-0 !px-2 text-[11px] flex-1" onClick={() => copy(f.file_url, f.id)}>
                  {copiedId === f.id ? 'Copied!' : 'Copy URL'}
                </button>
                <button className="btn-danger !h-7 !py-0 !px-2 text-[11px]" onClick={() => setDeleteId(f.id)} aria-label="Delete file">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDelete open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={onDelete} busy={busy} label="Delete this file from Supabase Storage?" />
    </div>
  );
}
