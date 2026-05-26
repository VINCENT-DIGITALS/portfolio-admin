import { classNames } from '@/lib/utils';

export function Field({
  label, hint, error, children, className,
}: { label?: string; hint?: string; error?: string | null; children: React.ReactNode; className?: string }) {
  return (
    <div className={classNames('mb-4', className)}>
      {label && <label className="label">{label}</label>}
      {children}
      {hint && !error && <p className="mt-1 text-xs muted-2">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={classNames('input', props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={classNames('input min-h-[120px] resize-y', props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={classNames('input', props.className)} />;
}
