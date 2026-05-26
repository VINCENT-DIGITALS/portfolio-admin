'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { ContactMessage } from '@/lib/types';
import { PageLoading, ErrorState, EmptyState } from '@/components/Loading';
import { ConfirmDelete } from '@/components/Modal';
import { PageHeader } from '@/components/admin/Breadcrumbs';
import { formatDate } from '@/lib/utils';
import { classNames } from '@/lib/utils';

export default function AdminMessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true); setError(null);
    apiClient.get<{ data: ContactMessage[] }>('/api/admin/contact-messages')
      .then((r) => setItems(r.data))
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  async function toggleRead(m: ContactMessage) {
    const newVal = !m.is_read;
    await apiClient.patch(`/api/admin/contact-messages/${m.id}/read`, { is_read: newVal });
    setItems((arr) => arr.map((x) => x.id === m.id ? { ...x, is_read: newVal } : x));
  }

  async function onDelete() {
    if (!deleteId) return;
    setBusy(true);
    try {
      await apiClient.delete(`/api/admin/contact-messages/${deleteId}`);
      setItems((arr) => arr.filter((x) => x.id !== deleteId));
      setDeleteId(null);
    } finally { setBusy(false); }
  }

  if (loading) return <PageLoading />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const unread = items.filter((m) => !m.is_read).length;

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Messages' }]}
        title="Contact messages"
        subtitle={`${unread} unread of ${items.length} total`}
      />

      {items.length === 0 ? (
        <EmptyState title="No messages yet" description="Submissions from the public contact form will show up here." />
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <article key={m.id} className={classNames('card', !m.is_read && 'ring-1 ring-brand-500/40')}>
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{m.name}</p>
                    {!m.is_read && <span className="badge-brand">New</span>}
                  </div>
                  <p className="mt-0.5 text-xs muted-2 break-all">
                    {m.email} · {formatDate(m.created_at, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  {m.subject && <p className="mt-1 text-sm font-medium">{m.subject}</p>}
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <button className="btn-secondary !h-9 !py-0" onClick={() => toggleRead(m)}>{m.is_read ? 'Mark unread' : 'Mark read'}</button>
                  <a className="btn-secondary !h-9 !py-0" href={`mailto:${m.email}`}>Reply</a>
                  <button className="btn-danger !h-9 !py-0" onClick={() => setDeleteId(m.id)}>Delete</button>
                </div>
              </header>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-800 dark:text-slate-200">{m.message}</p>
            </article>
          ))}
        </div>
      )}

      <ConfirmDelete open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={onDelete} busy={busy} label="Delete this message?" />
    </div>
  );
}
