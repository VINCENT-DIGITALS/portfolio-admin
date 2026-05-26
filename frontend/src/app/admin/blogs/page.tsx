'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { Blog } from '@/lib/types';
import { PageLoading, ErrorState, EmptyState } from '@/components/Loading';
import { ConfirmDelete } from '@/components/Modal';
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
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link href="/admin/blogs/create" className="btn-primary">+ New post</Link>
      </div>
      {items.length === 0 ? (
        <EmptyState title="No posts yet" action={<Link href="/admin/blogs/create" className="btn-primary">+ Create post</Link>} />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead><tr><th>Title</th><th>Status</th><th>Published</th><th></th></tr></thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {items.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="font-medium">{b.title}</div>
                    <div className="text-xs text-slate-500">{b.slug}</div>
                  </td>
                  <td>{b.is_published ? 'Published' : 'Draft'}</td>
                  <td>{formatDate(b.published_at)}</td>
                  <td className="text-right">
                    <Link className="text-brand-600 hover:underline" href={`/admin/blogs/${b.id}/edit`}>Edit</Link>
                    <button className="ml-3 text-red-600 hover:underline" onClick={() => setDeleteId(b.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDelete open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={onDelete} busy={busy} label="Delete this post?" />
    </div>
  );
}
