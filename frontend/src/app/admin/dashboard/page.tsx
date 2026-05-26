'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { DashboardData } from '@/lib/types';
import { PageLoading, ErrorState } from '@/components/Loading';
import { PageHeader } from '@/components/admin/Breadcrumbs';
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
    { label: 'Projects',         value: t.projects,         sub: `${t.published_projects} published` },
    { label: 'Blogs',            value: t.blogs,            sub: `${t.published_blogs} published` },
    { label: 'Comments',         value: t.comments_total,   sub: `${t.comments_pending} pending` },
    { label: 'Unread messages',  value: t.unread_messages,  sub: `${t.contact_messages_total} total` },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Dashboard' }]}
        title="Dashboard"
        subtitle="Activity across projects, blogs, comments, and messages."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card !p-4 sm:!p-5">
            <p className="text-xs font-medium uppercase tracking-wider muted-2">{c.label}</p>
            <p className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tighter text-slate-900 dark:text-slate-50">{c.value}</p>
            <p className="mt-1 text-xs muted-2">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight">Recent comments</h2>
            <span className="badge">{data.recent_comments.length}</span>
          </div>
          {data.recent_comments.length === 0 ? (
            <p className="mt-2 text-sm muted-2">No comments yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-200/70 text-sm dark:divide-slate-800/70">
              {data.recent_comments.map((c) => (
                <li key={c.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{c.name}</p>
                    <span className={
                      c.status === 'approved' ? 'badge-emerald' :
                      c.status === 'rejected' ? 'badge-red' : 'badge-amber'
                    }>{c.status}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 muted">{c.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight">Recent messages</h2>
            <span className="badge">{data.recent_messages.length}</span>
          </div>
          {data.recent_messages.length === 0 ? (
            <p className="mt-2 text-sm muted-2">No messages yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-200/70 text-sm dark:divide-slate-800/70">
              {data.recent_messages.map((m) => (
                <li key={m.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{m.name}</p>
                    <span className="text-xs muted-2">{formatDate(m.created_at, { dateStyle: 'medium' })}</span>
                  </div>
                  <p className="text-xs muted-2 break-all">{m.email}</p>
                  <p className="mt-1 line-clamp-2 muted">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
