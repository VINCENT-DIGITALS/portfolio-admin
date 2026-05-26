'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { Comment, CommentStatus } from '@/lib/types';
import { PageLoading, ErrorState, EmptyState } from '@/components/Loading';
import { ConfirmDelete } from '@/components/Modal';
import { PageHeader } from '@/components/admin/Breadcrumbs';
import { classNames } from '@/lib/utils';
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

  const filterTabs = [{ k: '', l: 'All' }, ...STATUSES.map((s) => ({ k: s, l: s.charAt(0).toUpperCase() + s.slice(1) }))];

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Comments' }]}
        title="Comments"
        subtitle="Approve or reject visitor comments before they go public."
        actions={(
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs dark:border-slate-800 dark:bg-slate-900">
            {filterTabs.map((opt) => (
              <button
                key={opt.k || 'all'}
                onClick={() => setFilter(opt.k as '' | CommentStatus)}
                className={classNames(
                  'rounded-md px-3 py-1.5 font-medium transition',
                  filter === opt.k
                    ? 'bg-brand-600 text-white dark:bg-brand-500 dark:text-slate-950'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                )}
              >
                {opt.l}
              </button>
            ))}
          </div>
        )}
      />

      {items.length === 0 ? (
        <EmptyState title="No comments" description={filter ? `No "${filter}" comments yet.` : 'Visitor comments will show up here.'} />
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <article key={c.id} className="card">
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{c.name}</p>
                    <span className={
                      c.status === 'approved' ? 'badge-emerald' :
                      c.status === 'rejected' ? 'badge-red' : 'badge-amber'
                    }>{c.status}</span>
                  </div>
                  <p className="mt-0.5 text-xs muted-2 break-all">
                    {c.email ?? '—'} · {formatDate(c.created_at, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  {c.status !== 'approved' && <button className="btn-secondary !h-9 !py-0" onClick={() => setStatus(c.id, 'approved')}>Approve</button>}
                  {c.status !== 'rejected' && <button className="btn-secondary !h-9 !py-0" onClick={() => setStatus(c.id, 'rejected')}>Reject</button>}
                  {c.status !== 'pending' && <button className="btn-secondary !h-9 !py-0" onClick={() => setStatus(c.id, 'pending')}>Re-queue</button>}
                  <button className="btn-danger !h-9 !py-0" onClick={() => setDeleteId(c.id)}>Delete</button>
                </div>
              </header>
              <p className="mt-3 text-sm leading-relaxed text-slate-800 dark:text-slate-200">{c.message}</p>
            </article>
          ))}
        </div>
      )}

      <ConfirmDelete open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={onDelete} busy={busy} label="Delete this comment?" />
    </div>
  );
}
