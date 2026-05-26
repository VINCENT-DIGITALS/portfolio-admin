import type { Metadata } from 'next';
import { PublicLayout } from '@/components/PublicLayout';
import { CommentForm } from '@/components/CommentForm';
import { ssrFetch } from '@/lib/api';
import type { Comment } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export const revalidate = 30;
export const metadata: Metadata = { title: 'Comments' };

export default async function CommentsPage() {
  const res = await ssrFetch<{ data: Comment[] }>('/api/comments?general_only=1');
  const comments = res?.data ?? [];

  return (
    <PublicLayout>
      <section className="container-page section">
        <p className="eyebrow">Words from others</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tighter sm:text-4xl">Testimonials</h1>
        <p className="mt-2 max-w-2xl text-base muted">Public comments from colleagues, clients, and visitors.</p>

        {comments.length === 0 ? (
          <p className="mt-8 text-sm muted-2">No approved comments yet — be the first below.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {comments.map((c) => (
              <blockquote key={c.id} className="card">
                {c.rating && (
                  <div className="flex items-center gap-0.5 text-amber-500" aria-label={`${c.rating} out of 5`}>
                    {'★'.repeat(c.rating)}<span className="text-slate-200 dark:text-slate-700">{'★'.repeat(5 - c.rating)}</span>
                  </div>
                )}
                <p className="mt-3 text-sm leading-relaxed text-slate-800 dark:text-slate-200">&ldquo;{c.message}&rdquo;</p>
                <footer className="mt-4 text-xs muted-2">
                  — <span className="font-medium text-slate-700 dark:text-slate-300">{c.name}</span>, {formatDate(c.created_at, { dateStyle: 'medium' })}
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </section>

      <section className="container-page pb-16 max-w-2xl">
        <CommentForm title="Leave a testimonial" hint="Comments are reviewed before being published." />
      </section>
    </PublicLayout>
  );
}
