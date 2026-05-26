'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { ContactMessage } from '@/lib/types';
import { PageLoading, ErrorState, EmptyState } from '@/components/Loading';
import { ConfirmDelete } from '@/components/Modal';
import { formatDate } from '@/lib/utils';

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

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Contact messages</h1>
      {items.length === 0 ? (
        <EmptyState title="No messages yet" />
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className={`card ${m.is_read ? '' : 'border-brand-500/50'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {m.name} {!m.is_read && <span className="badge ml-2">new</span>}
                  </p>
                  <p className="text-xs text-slate-500">{m.email} · {formatDate(m.created_at, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  {m.subject && <p className="text-sm font-medium mt-1">{m.subject}</p>}
                </div>
                <div className="flex gap-2 text-sm">
                  <button className="btn-secondary" onClick={() => toggleRead(m)}>{m.is_read ? 'Mark unread' : 'Mark read'}</button>
                  <a className="btn-secondary" href={`mailto:${m.email}`}>Reply</a>
                  <button className="btn-danger" onClick={() => setDeleteId(m.id)}>Delete</button>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm">{m.message}</p>
            </div>
          ))}
        </div>
      )}
      <ConfirmDelete open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={onDelete} busy={busy} label="Delete this message?" />
    </div>
  );
}
