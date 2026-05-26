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
}

export function AvatarUpload({
  value, onChange, folder = 'profile', label = 'Profile picture', hint,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {/* Preview */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-600">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
              </svg>
            </div>
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-950/70">
              <Spinner />
            </div>
          )}
        </div>

        {/* Drop zone / picker */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="flex-1 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 text-sm transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-slate-600 dark:hover:bg-slate-900"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPick}
            disabled={busy}
          />
          <div className="flex flex-wrap items-center gap-2">
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
          <p className="mt-2 text-xs muted-2">
            Drop an image here or click to choose. PNG / JPG / WebP up to 20 MB.
          </p>
        </div>
      </div>

      {hint && !error && <p className="mt-1 text-xs muted-2">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
