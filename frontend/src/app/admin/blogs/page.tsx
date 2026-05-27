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
        <>
          <div className="panel divide-y divide-slate-100 overflow-hidden md:hidden dark:divide-slate-800">
            {items.map((b) => (
              <article key={b.id} className="px-4 py-4">
                <header className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="break-words text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">{b.title}</h2>
                    <p className="mt-0.5 break-all text-xs text-slate-500 dark:text-slate-400">/{b.slug}</p>
                  </div>
                  {b.is_published ? <span className="badge-emerald shrink-0">Published</span> : <span className="badge-amber shrink-0">Draft</span>}
                </header>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Published {formatDate(b.published_at) || 'not scheduled'}</span>
                  <span>{b.tags?.length ? `${b.tags.length} tags` : 'No tags'}</span>
                </div>

                <div className="mt-4 flex items-center justify-end gap-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <Link className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-300" href={`/admin/blogs/${b.id}/edit`}>Edit</Link>
                  <button className="text-sm font-medium text-red-600 hover:underline dark:text-red-400" onClick={() => setDeleteId(b.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>

          <div className="panel hidden !p-0 overflow-hidden md:block">
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
        </>
      )}

      <ConfirmDelete open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={onDelete} busy={busy} label="Delete this post?" />
    </div>
  );
}
