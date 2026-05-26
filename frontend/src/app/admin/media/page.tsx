'use client';

import { useEffect, useRef, useState } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import type { MediaFile } from '@/lib/types';
import { PageLoading, ErrorState, EmptyState } from '@/components/Loading';
import { ConfirmDelete } from '@/components/Modal';
import { Field, Input } from '@/components/Field';

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [folder, setFolder] = useState('uploads');
  const [uploadError, setUploadError] = useState<string | null>(null);
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

  function copy(url: string) {
    navigator.clipboard?.writeText(url);
  }

  if (loading) return <PageLoading />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Media library</h1>

      <form onSubmit={onUpload} className="card mb-6 max-w-2xl">
        {uploadError && <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{uploadError}</div>}
        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <Field label="Folder"><Input value={folder} onChange={(e) => setFolder(e.target.value)} /></Field>
          <Field label="File"><input ref={fileRef} type="file" className="input" required /></Field>
        </div>
        <button className="btn-primary" disabled={busy}>{busy ? 'Uploading…' : 'Upload to Supabase'}</button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="No uploads yet" description="Files uploaded here are stored in your Supabase bucket." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((f) => (
            <div key={f.id} className="card p-3">
              {f.file_type?.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.file_url} alt={f.file_name} className="aspect-square w-full rounded-md object-cover" />
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-md bg-slate-100 text-slate-400 dark:bg-slate-800">📄</div>
              )}
              <p className="mt-2 truncate text-xs font-medium">{f.file_name}</p>
              <p className="text-xs text-slate-500">{f.file_type}</p>
              <div className="mt-2 flex gap-2">
                <button className="btn-secondary !py-1 text-xs" onClick={() => copy(f.file_url)}>Copy URL</button>
                <button className="btn-danger !py-1 text-xs" onClick={() => setDeleteId(f.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDelete open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={onDelete} busy={busy} label="Delete this file from Supabase Storage?" />
    </div>
  );
}
