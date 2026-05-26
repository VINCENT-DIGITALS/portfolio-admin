import Link from 'next/link';
import type { Blog } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group card flex flex-col gap-3 transition hover:shadow-md">
      {blog.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={blog.cover_image_url} alt={blog.title} className="aspect-video w-full rounded-lg object-cover" loading="lazy" />
      )}
      <div>
        <p className="text-xs text-slate-500">{formatDate(blog.published_at, { dateStyle: 'medium' })}</p>
        <h3 className="mt-1 text-lg font-semibold group-hover:text-brand-600">{blog.title}</h3>
        {blog.excerpt && <p className="mt-1 line-clamp-3 text-sm text-slate-500">{blog.excerpt}</p>}
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
