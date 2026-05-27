'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { Comment } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { CommentForm } from '@/components/CommentForm';

export function ProjectComments({ projectId }: { projectId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(null);

    apiClient.get<{ data: Comment[] }>(`/api/comments?project_id=${projectId}`, { auth: 'none' })
      .then((res) => {
        if (mounted) setComments(res.data);
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Failed to load comments.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [projectId]);

  return (
    <section className="mt-14">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Comments
          {comments.length > 0 && (
            <span className="ml-2 align-middle text-sm muted-2 font-normal">({comments.length})</span>
          )}
        </h2>
      </div>

      {loading ? (
        <p className="mt-3 text-sm muted-2">Loading comments...</p>
      ) : error ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : comments.length === 0 ? (
        <p className="mt-3 text-sm muted-2">No comments yet - be the first to share your thoughts below.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="card">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{c.name}</p>
                  {c.rating && (
                    <span className="text-amber-500" aria-label={`${c.rating} out of 5`}>
                      {'★'.repeat(c.rating)}<span className="text-slate-200 dark:text-slate-700">{'★'.repeat(5 - c.rating)}</span>
                    </span>
                  )}
                </div>
                <span className="text-xs muted-2">{formatDate(c.created_at, { dateStyle: 'medium' })}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200">{c.message}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <CommentForm
          projectId={projectId}
          title="Leave a comment on this project"
          hint="Your comment will appear once approved by the admin."
        />
      </div>
    </section>
  );
}
