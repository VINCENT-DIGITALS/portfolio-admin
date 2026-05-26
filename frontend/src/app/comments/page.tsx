import type { Metadata } from 'next';
import { PublicLayout } from '@/components/PublicLayout';
import { ssrFetch } from '@/lib/api';
import type { Comment } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export const revalidate = 30;
export const metadata: Metadata = { title: 'Comments' };

export default async function CommentsPage() {
  const res = await ssrFetch<{ data: Comment[] }>('/api/comments');
  const comments = res?.data ?? [];

  return (
    <PublicLayout>
      <section className="container-page py-12">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <p className="mt-2 text-slate-500">Public comments from colleagues, clients, and visitors.</p>
        {comments.length === 0 ? (
          <p className="mt-8 text-sm text-slate-500">No approved comments yet.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {comments.map((c) => (
              <blockquote key={c.id} className="card">
                {c.rating && (
                  <div className="flex items-center gap-1 text-amber-500">
                    {'★'.repeat(c.rating)}<span className="text-slate-300">{'★'.repeat(5 - c.rating)}</span>
                  </div>
                )}
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">"{c.message}"</p>
                <footer className="mt-3 text-xs text-slate-500">— {c.name}, {formatDate(c.created_at, { dateStyle: 'medium' })}</footer>
              </blockquote>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
