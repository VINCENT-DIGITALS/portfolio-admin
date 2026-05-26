'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { Blog } from '@/lib/types';
import { PageLoading, ErrorState, EmptyState } from '@/components/Loading';
import { ConfirmDelete } from '@/components/Modal';
import { PageHeader } from '@/components/admin/Breadcrumbs';
import { formatDate } from '@/lib/utils';

export default function AdminBlogsPage() {
  const [items, setItems] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true); setError(null);
    apiClient.get<{ data: Blog[] }>('/api/admin/blogs')
      .then((r) => setItems(r.data))
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  async function onDelete() {
    if (!deleteId) return;
    setBusy(true);
    try {
      await apiClient.delete(`/api/admin/blogs/${deleteId}`);
      setItems((arr) => arr.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } finally { setBusy(false); }
  }

  if (loading) return <PageLoading />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Blogs' }]}
        title="Blogs"
        subtitle="Articles and notes."
        actions={<Link href="/admin/blogs/create" className="btn-primary">+ New post</Link>}
      />

      {items.length === 0 ? (
        <EmptyState title="No posts yet" action={<Link href="/admin/blogs/create" className="btn-primary">+ Create post</Link>} />
      ) : (
        <div className="panel !p-0 overflow-hidden">
          <div className="scroll-x">
            <table className="table">
              <thead><tr><th>Title</th><th>Status</th><th>Published</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {items.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td>
                      <div className="font-medium text-slate-900 dark:text-slate-100">{b.title}</div>
                      <div className="text-xs muted-2">/{b.slug}</div>
                    </td>
                    <td>{b.is_published ? <span className="badge-emerald">Published</span> : <span className="badge-amber">Draft</span>}</td>
                    <td className="muted-2">{formatDate(b.published_at)}</td>
                    <td className="text-right whitespace-nowrap">
                      <Link className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-300" href={`/admin/blogs/${b.id}/edit`}>Edit</Link>
                      <button className="ml-3 text-sm font-medium text-red-600 hover:underline dark:text-red-400" onClick={() => setDeleteId(b.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDelete open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={onDelete} busy={busy} label="Delete this post?" />
    </div>
  );
}
