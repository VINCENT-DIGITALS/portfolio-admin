import Link from 'next/link';
import type { Project } from '@/lib/types';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      prefetch
      className="group card-hover flex flex-col gap-4 !p-4 sm:!p-5"
    >
      <div className="relative overflow-hidden rounded-lg">
        {project.featured_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.featured_image_url}
            alt={project.title}
            className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="aspect-[16/10] w-full bg-gradient-to-br from-brand-100 via-white to-slate-50 dark:from-brand-500/15 dark:via-slate-900 dark:to-slate-900" />
        )}
        {project.is_featured && (
          <span className="badge-emerald absolute left-2 top-2">Featured</span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold tracking-tight text-slate-900 group-hover:text-brand-700 dark:text-slate-50 dark:group-hover:text-brand-300">
          {project.title}
        </h3>
        {project.short_description && (
          <p className="mt-1.5 line-clamp-3 text-sm muted">{project.short_description}</p>
        )}
      </div>

      {project.tech_stack?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.slice(0, 5).map((t) => (
            <span key={t} className="badge">{t}</span>
          ))}
          {project.tech_stack.length > 5 && (
            <span className="badge">+{project.tech_stack.length - 5}</span>
          )}
        </div>
      )}
    </Link>
  );
}
