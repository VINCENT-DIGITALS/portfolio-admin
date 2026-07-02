'use client';

import { Modal } from './Modal';

/**
 * Shown when a submission (contact, comment, …) can't reach the backend.
 * In the serverless/no-backend fallback mode the public site still renders,
 * but write actions have nowhere to go — so we tell the visitor this feature
 * is currently under development rather than showing a raw network error.
 */
export function FeatureInDevelopmentModal({
  open,
  onClose,
  action = 'This feature',
}: {
  open: boolean;
  onClose: () => void;
  /** e.g. "Sending messages" or "Submitting comments". */
  action?: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Feature in development">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </span>
        <div>
          <p className="text-slate-800 dark:text-slate-100">
            {action} is currently under development and temporarily unavailable.
          </p>
          <p className="mt-1 text-xs muted-2">
            The rest of the site is running from cached content. Please try again later.
          </p>
        </div>
      </div>
    </Modal>
  );
}
