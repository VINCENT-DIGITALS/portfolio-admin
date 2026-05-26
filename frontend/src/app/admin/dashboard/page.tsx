'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { DashboardData } from '@/lib/types';
import { PageLoading, ErrorState } from '@/components/Loading';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true); setError(null);
    apiClient.get<DashboardData>('/api/admin/dashboard')
      .then(setData)
      .catch((e) => setError(e?.message ?? 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <PageLoading />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return null;

  const t = data.totals;
  const cards = [
    { label: 'Projects', value: t.projects, sub: `${t.published_projects} published` },
    { label: 'Blogs', value: t.blogs, sub: `${t.published_blogs} published` },
    { label: 'Comments', value: t.comments_total, sub: `${t.comments_pending} pending` },
    { label: 'Unread Messages', value: t.unread_messages, sub: `${t.contact_messages_total} total` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-sm text-slate-500">Overview of your portfolio activity.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-1 text-3xl font-bold">{c.value}</p>
            <p className="mt-1 text-xs text-slate-500">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-semibold">Recent comments</h2>
          {data.recent_comments.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No comments yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-200 text-sm dark:divide-slate-800">
              {data.recent_comments.map((c) => (
                <li key={c.id} className="py-2">
                  <p className="font-medium">{c.name} <span className="badge ml-2">{c.status}</span></p>
                  <p className="mt-1 line-clamp-2 text-slate-500">{c.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <h2 className="font-semibold">Recent messages</h2>
          {data.recent_messages.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No messages yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-200 text-sm dark:divide-slate-800">
              {data.recent_messages.map((m) => (
                <li key={m.id} className="py-2">
                  <p className="font-medium">{m.name} <span className="text-xs text-slate-500">{formatDate(m.created_at, { dateStyle: 'medium' })}</span></p>
                  <p className="text-xs text-slate-500">{m.email}</p>
                  <p className="mt-1 line-clamp-2 text-slate-600 dark:text-slate-400">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
