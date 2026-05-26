'use client';

import { useRef, useState } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import type { MediaFile } from '@/lib/types';
import { Spinner } from '@/components/Loading';

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
  hint?: string;
  aspect?: 'video' | 'square';
}

export function BannerUpload({
  value,
  onChange,
  folder = 'projects',
  label = 'Featured image',
  hint = 'Upload a banner image — PNG / JPG / WebP up to 20 MB.',
  aspect = 'video',
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const aspectClass = aspect === 'video' ? 'aspect-[16/9]' : 'aspect-square';

  async function handleFile(file: File) {
    setBusy(true); setError(null);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    try {
      const r = await apiClient.post<{ data: MediaFile }>('/api/admin/media/upload', fd);
      onChange(r.data.file_url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  return (
    <div className="mb-4">
      {label && <label className="label">{label}</label>}

      {/* Preview / drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={
          `relative ${aspectClass} w-full overflow-hidden rounded-xl border ` +
          (value
            ? 'border-slate-200 dark:border-slate-800'
            : 'border-dashed border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-slate-600 dark:hover:bg-slate-900') +
          ' transition'
        }
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Featured" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <p className="text-sm">Drag &amp; drop an image, or click below to choose</p>
          </div>
        )}

        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-950/70">
            <Spinner />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPick}
          disabled={busy}
        />
        <button
          type="button"
          className="btn-secondary !h-9 !py-0"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          {busy && <Spinner />}
          {value ? (busy ? 'Uploading…' : 'Replace image') : (busy ? 'Uploading…' : 'Choose image')}
        </button>
        {value && (
          <button
            type="button"
            className="btn-ghost !h-9 !py-0 text-red-600 hover:!bg-red-50 dark:text-red-400 dark:hover:!bg-red-950/40"
            onClick={() => onChange(null)}
            disabled={busy}
          >
            Remove
          </button>
        )}
      </div>

      {hint && !error && <p className="mt-1.5 text-xs muted-2">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
