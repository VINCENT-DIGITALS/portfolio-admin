export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white/60 py-6 dark:border-slate-800/60 dark:bg-slate-950/60">
      <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-slate-500 md:flex-row">
        <span>© {new Date().getFullYear()} My Portfolio. All rights reserved.</span>
        <span>Built with Next.js · Laravel · Supabase.</span>
      </div>
    </footer>
  );
}
