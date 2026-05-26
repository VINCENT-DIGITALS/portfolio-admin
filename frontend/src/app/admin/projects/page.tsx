'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { Project } from '@/lib/types';
import { PageLoading, ErrorState, EmptyState } from '@/components/Loading';
import { ConfirmDelete } from '@/components/Modal';

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true); setError(null);
    apiClient.get<{ data: Project[] }>('/api/admin/projects')
      .then((r) => setItems(r.data))
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  async function onDelete() {
    if (!deleteId) return;
    setBusy(true);
    try {
      await apiClient.delete(`/api/admin/projects/${deleteId}`);
      setItems((arr) => arr.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } finally { setBusy(false); }
  }

  if (loading) return <PageLoading />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/admin/projects/create" className="btn-primary">+ New project</Link>
      </div>
      {items.length === 0 ? (
        <EmptyState title="No projects yet" description="Create your first project to get started."
          action={<Link href="/admin/projects/create" className="btn-primary">+ Create project</Link>} />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th><th>Status</th><th>Featured</th><th>Published</th><th>Order</th><th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-slate-500">{p.slug}</div>
                  </td>
                  <td>{p.status}</td>
                  <td>{p.is_featured ? 'Yes' : '—'}</td>
                  <td>{p.is_published ? 'Yes' : 'Draft'}</td>
                  <td>{p.sort_order}</td>
                  <td className="text-right">
                    <Link className="text-brand-600 hover:underline" href={`/admin/projects/${p.id}/edit`}>Edit</Link>
                    <button className="ml-3 text-red-600 hover:underline" onClick={() => setDeleteId(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDelete
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={onDelete}
        busy={busy}
        label="Delete this project? Any associated comments will lose their reference."
      />
    </div>
  );
}
