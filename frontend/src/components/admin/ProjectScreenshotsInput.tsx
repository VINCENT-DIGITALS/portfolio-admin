'use client';

import { useRef, useState } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import type { MediaFile, ProjectImage } from '@/lib/types';
import { Spinner } from '@/components/Loading';

type ScreenshotItem = { id?: number } & Pick<ProjectImage, 'image_url' | 'caption' | 'sort_order'>;

interface Props {
  items: ScreenshotItem[];
  onChange: (items: ScreenshotItem[]) => void;
  error?: string;
}

export function ProjectScreenshotsInput({ items, onChange, error }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setUploadError(null);

    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'projects/screenshots');

    try {
      const response = await apiClient.post<{ data: MediaFile }>('/api/admin/media/upload', fd);
      onChange([
        ...items,
        {
          image_url: response.data.file_url,
          caption: '',
          sort_order: items.length,
        },
      ]);
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  }

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    const next = [...items];
    const [current] = next.splice(index, 1);
    next.splice(nextIndex, 0, current);
    onChange(next.map((item, order) => ({ ...item, sort_order: order })));
  }

  function updateItem(index: number, patch: Partial<ScreenshotItem>) {
    onChange(items.map((item, itemIndex) => (
      itemIndex === index ? { ...item, ...patch } : item
    )));
  }

  function removeItem(index: number) {
    onChange(
      items
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, order) => ({ ...item, sort_order: order }))
    );
  }

  return (
    <section className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Screenshots</h2>
          <p className="mt-1 text-sm muted-2">
            Add one or more app screens. They will appear in a compact gallery with thumbnail previews.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            {busy ? 'Uploading…' : '+ Add screenshot'}
          </button>
        </div>
      </div>

      {(error || uploadError) && (
        <p className="mt-3 text-xs text-red-600 dark:text-red-400">{error ?? uploadError}</p>
      )}

      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-8 text-center text-sm muted-2 dark:border-slate-700 dark:bg-slate-900/40">
          No screenshots yet.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {items.map((item, index) => (
            <div key={item.id ?? item.image_url ?? index} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-full sm:w-36">
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 sm:aspect-[9/16] dark:border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image_url} alt={item.caption || `Screenshot ${index + 1}`} className="h-full w-full object-contain" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <label className="label">Caption</label>
                  <input
                    className="input"
                    value={item.caption ?? ''}
                    onChange={(e) => updateItem(index, { caption: e.target.value })}
                    placeholder={`Screenshot ${index + 1}`}
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" className="btn-ghost !h-9 !py-0" onClick={() => moveItem(index, -1)} disabled={index === 0}>
                      ↑ Move up
                    </button>
                    <button type="button" className="btn-ghost !h-9 !py-0" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1}>
                      ↓ Move down
                    </button>
                    <button
                      type="button"
                      className="btn-ghost !h-9 !py-0 text-red-600 hover:!bg-red-50 dark:text-red-400 dark:hover:!bg-red-950/40"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
