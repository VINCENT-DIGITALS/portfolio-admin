'use client';

import { useEffect } from 'react';

export function Modal({ open, onClose, title, children, footer }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl animate-fade-in dark:border-slate-800 dark:bg-slate-900"
      >
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <div className="mt-3 text-sm muted">{children}</div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {footer ?? <button className="btn-secondary" onClick={onClose}>Close</button>}
        </div>
      </div>
    </div>
  );
}

export function ConfirmDelete({ open, onClose, onConfirm, label = 'Delete this item?', busy }: {
  open: boolean; onClose: () => void; onConfirm: () => void; label?: string; busy?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Confirm delete"
      footer={(
        <>
          <button className="btn-secondary" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </>
      )}
    >
      <p className="text-slate-800 dark:text-slate-100">{label}</p>
      <p className="mt-1 text-xs muted-2">This action cannot be undone.</p>
    </Modal>
  );
}
