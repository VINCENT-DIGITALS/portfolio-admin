import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200/70 bg-white/60 dark:border-slate-800/70 dark:bg-slate-950/60">
      <div className="container-page flex flex-col items-center justify-between gap-3 py-8 sm:flex-row">
        <p className="inline-flex items-center gap-2 text-xs muted-2">
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
          <span>© {new Date().getFullYear()} My Portfolio. All rights reserved.</span>
        </p>
        <nav className="flex items-center gap-4 text-xs muted-2" aria-label="Footer">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
          <Link href="/projects" className="hover:text-slate-900 dark:hover:text-white">Projects</Link>
          <Link href="/blogs" className="hover:text-slate-900 dark:hover:text-white">Blogs</Link>
          <Link href="/contact" className="hover:text-slate-900 dark:hover:text-white">Contact</Link>
        </nav>
        <p className="text-[11px] muted-2">Built with Next.js · Laravel · Supabase</p>
      </div>
    </footer>
  );
}
