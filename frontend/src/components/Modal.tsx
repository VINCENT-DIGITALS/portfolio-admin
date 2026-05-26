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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-xl dark:bg-slate-900">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{children}</div>
        <div className="mt-5 flex justify-end gap-2">
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
      <p>{label}</p>
      <p className="mt-2 text-xs text-slate-500">This action cannot be undone.</p>
    </Modal>
  );
}
