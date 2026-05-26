export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={'inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent ' + className}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="container-page flex min-h-[40vh] items-center justify-center gap-3 text-slate-500">
      <Spinner />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="card text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
      <h3 className="font-semibold">Something went wrong</h3>
      <p className="mt-1 text-sm">{message}</p>
      {onRetry && (
        <button type="button" className="btn-secondary mt-3" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
