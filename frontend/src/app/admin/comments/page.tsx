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
const FILTER_TABS: { k: '' | CommentStatus; l: string }[] = [
  { k: '', l: 'All' },
  ...STATUSES.map((s) => ({ k: s, l: s.charAt(0).toUpperCase() + s.slice(1) })),
];

export default function AdminCommentsPage() {
  const [items, setItems] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'' | CommentStatus>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionBusyId, setActionBusyId] = useState<number | null>(null);

  const load = (status = filter) => {
    setLoading(true); setError(null);
    const q = status ? `?status=${status}` : '';
    apiClient.get<{ data: Comment[] }>(`/api/admin/comments${q}`)
      .then((r) => setItems(r.data))
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => {
        setHasLoaded(true);
        setLoading(false);
      });
  };
  useEffect(load, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function setStatus(id: number, status: CommentStatus) {
    setActionBusyId(id);
    setError(null);
    try {
      await apiClient.patch(`/api/admin/comments/${id}/status`, { status });
      setItems((arr) => arr
        .map((c) => c.id === id ? { ...c, status } : c)
        .filter((c) => !filter || c.status === filter));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update comment.');
    } finally {
      setActionBusyId(null);
    }
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

  const initialLoading = loading && !hasLoaded && !error;
  if (initialLoading) return <PageLoading />;
  if (error && items.length === 0) return <ErrorState message={error} onRetry={() => load()} />;

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Comments' }]}
        title="Comments"
        subtitle="Moderate visitor feedback before it appears publicly."
        actions={(
          <div className="w-full overflow-x-auto sm:w-auto">
            <div className="inline-flex min-w-max rounded-lg border border-slate-200 bg-white p-0.5 text-xs shadow-soft dark:border-slate-800 dark:bg-slate-900">
              {FILTER_TABS.map((opt) => (
                <button
                  key={opt.k || 'all'}
                  type="button"
                  onClick={() => setFilter(opt.k)}
                  disabled={loading && filter === opt.k}
                  className={classNames(
                    'rounded-md px-3 py-1.5 font-medium transition disabled:cursor-default',
                    filter === opt.k
                      ? 'bg-brand-600 text-white dark:bg-brand-500 dark:text-slate-950'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                  )}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>
        )}
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          {error}
          <button type="button" className="ml-2 font-medium underline" onClick={() => load()}>Try again</button>
        </div>
      )}

      <div aria-busy={loading} className="relative">
        {loading && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" aria-hidden />
            Updating comments
          </div>
        )}

        {items.length === 0 ? (
          <EmptyState title="No comments" description={filter ? `No "${filter}" comments yet.` : 'Visitor comments will show up here.'} />
        ) : (
          <section className={classNames('panel overflow-hidden transition-opacity', loading && 'opacity-60')}>
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-5">
              <span>{items.length} {items.length === 1 ? 'comment' : 'comments'}</span>
              <span>{filter ? `${filter.charAt(0).toUpperCase()}${filter.slice(1)} queue` : 'All queues'}</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((c) => (
              <article key={c.id} className="px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <header className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                        {c.name.trim().charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium leading-5 text-slate-900 dark:text-slate-100">{c.name}</p>
                          <StatusBadge status={c.status} />
                          {c.rating && <Rating value={c.rating} />}
                        </div>
                        <p className="mt-0.5 break-all text-xs text-slate-500 dark:text-slate-400">
                          {c.email ?? 'No email'} · {formatDate(c.created_at, { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                    </header>

                    <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {c.message}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
                    {c.status !== 'approved' && (
                      <button
                        className="btn-secondary !h-8 !px-3 !py-0 text-xs"
                        onClick={() => setStatus(c.id, 'approved')}
                        disabled={actionBusyId === c.id}
                      >
                        Approve
                      </button>
                    )}
                    {c.status !== 'rejected' && (
                      <button
                        className="btn-secondary !h-8 !px-3 !py-0 text-xs"
                        onClick={() => setStatus(c.id, 'rejected')}
                        disabled={actionBusyId === c.id}
                      >
                        Reject
                      </button>
                    )}
                    {c.status !== 'pending' && (
                      <button
                        className="btn-secondary !h-8 !px-3 !py-0 text-xs"
                        onClick={() => setStatus(c.id, 'pending')}
                        disabled={actionBusyId === c.id}
                      >
                        Re-queue
                      </button>
                    )}
                    <button
                      className="inline-flex h-8 items-center rounded-md px-2.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                      onClick={() => setDeleteId(c.id)}
                      disabled={actionBusyId === c.id}
                    >
                      Delete
                    </button>
                    {actionBusyId === c.id && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">Saving</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
            </div>
          </section>
        )}
      </div>

      <ConfirmDelete open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={onDelete} busy={busy} label="Delete this comment?" />
    </div>
  );
}

function StatusBadge({ status }: { status: CommentStatus }) {
  return (
    <span className={
      status === 'approved' ? 'badge-emerald' :
      status === 'rejected' ? 'badge-red' : 'badge-amber'
    }>
      {status}
    </span>
  );
}

function Rating({ value }: { value: number }) {
  return (
    <span className="text-xs font-medium text-amber-600 dark:text-amber-300" aria-label={`${value} out of 5`}>
      {'★'.repeat(value)}
    </span>
  );
}
