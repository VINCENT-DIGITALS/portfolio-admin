import Link from 'next/link';
import type { Blog } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group card-hover flex flex-col gap-3 !p-4 sm:!p-5">
      {blog.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={blog.cover_image_url}
          alt={blog.title}
          className="aspect-[16/9] w-full rounded-lg object-cover transition duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
      ) : (
        <div className="aspect-[16/9] w-full rounded-lg bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900" />
      )}
      <div>
        <p className="text-xs muted-2">{formatDate(blog.published_at, { dateStyle: 'medium' })}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 group-hover:text-brand-700 dark:text-slate-50 dark:group-hover:text-brand-300">
          {blog.title}
        </h3>
        {blog.excerpt && <p className="mt-1.5 line-clamp-3 text-sm muted">{blog.excerpt}</p>}
      </div>
      {blog.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {blog.tags.slice(0, 4).map((t) => (
            <span key={t} className="badge">#{t}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
