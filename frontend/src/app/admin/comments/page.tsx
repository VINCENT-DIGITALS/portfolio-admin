'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { Comment, CommentStatus } from '@/lib/types';
import { PageLoading, ErrorState, EmptyState } from '@/components/Loading';
import { ConfirmDelete } from '@/components/Modal';
import { formatDate } from '@/lib/utils';

const STATUSES: CommentStatus[] = ['pending', 'approved', 'rejected'];

export default function AdminCommentsPage() {
  const [items, setItems] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'' | CommentStatus>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true); setError(null);
    const q = filter ? `?status=${filter}` : '';
    apiClient.get<{ data: Comment[] }>(`/api/admin/comments${q}`)
      .then((r) => setItems(r.data))
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(load, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function setStatus(id: number, status: CommentStatus) {
    await apiClient.patch(`/api/admin/comments/${id}/status`, { status });
    setItems((arr) => arr.map((c) => c.id === id ? { ...c, status } : c));
  }

  async function onDelete() {
    if (!deleteId) return;
    setBusy(true);
    try {
      await apiClient.delete(`/api/admin/comments/${deleteId}`);
      setItems((arr) => arr.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    } finally { setBusy(false); }
  }

  if (loading) return <PageLoading />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Comments</h1>
        <div className="flex gap-2 text-sm">
          <button className={`btn-secondary ${!filter ? '!bg-brand-600 !text-white' : ''}`} onClick={() => setFilter('')}>All</button>
          {STATUSES.map((s) => (
            <button key={s} className={`btn-secondary ${filter === s ? '!bg-brand-600 !text-white' : ''}`} onClick={() => setFilter(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState title="No comments" />
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <div key={c.id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{c.name} <span className="badge ml-2">{c.status}</span></p>
                  <p className="text-xs text-slate-500">{c.email} · {formatDate(c.created_at, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                <div className="flex gap-2 text-sm">
                  {c.status !== 'approved' && <button className="btn-secondary" onClick={() => setStatus(c.id, 'approved')}>Approve</button>}
                  {c.status !== 'rejected' && <button className="btn-secondary" onClick={() => setStatus(c.id, 'rejected')}>Reject</button>}
                  {c.status !== 'pending' && <button className="btn-secondary" onClick={() => setStatus(c.id, 'pending')}>Re-queue</button>}
                  <button className="btn-danger" onClick={() => setDeleteId(c.id)}>Delete</button>
                </div>
              </div>
              <p className="mt-2 text-sm">{c.message}</p>
            </div>
          ))}
        </div>
      )}

      <ConfirmDelete open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={onDelete} busy={busy} label="Delete this comment?" />
    </div>
  );
}
