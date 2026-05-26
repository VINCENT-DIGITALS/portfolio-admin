'use client';

import { useEffect, useState } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import { PageLoading, ErrorState } from '@/components/Loading';
import { Field, Input } from '@/components/Field';

type SettingsMap = Record<string, string | null>;

const DEFAULT_KEYS = ['site_title', 'site_tagline', 'theme', 'comments_open'];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [newKey, setNewKey] = useState('');

  const load = () => {
    setLoading(true);
    apiClient.get<{ data: SettingsMap }>('/api/admin/settings')
      .then((r) => setSettings(r.data ?? {}))
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  async function onSave() {
    setBusy(true); setSavedAt(null);
    try {
      await apiClient.post('/api/admin/settings', { settings });
      setSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally { setBusy(false); }
  }

  async function deleteKey(key: string) {
    await apiClient.delete(`/api/admin/settings/${encodeURIComponent(key)}`);
    setSettings(({ [key]: _drop, ...rest }) => rest);
  }

  function addKey() {
    if (!newKey.trim()) return;
    setSettings((s) => ({ ...s, [newKey.trim()]: '' }));
    setNewKey('');
  }

  if (loading) return <PageLoading />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const keys = Array.from(new Set([...DEFAULT_KEYS, ...Object.keys(settings)]));

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Settings</h1>
      <div className="card max-w-3xl">
        {savedAt && <div className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">Saved at {savedAt}.</div>}

        {keys.map((key) => (
          <div key={key} className="mb-3 grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_2fr_auto]">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">{key}</div>
            <Input value={settings[key] ?? ''} onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))} />
            {!DEFAULT_KEYS.includes(key) && (
              <button className="btn-danger" onClick={() => deleteKey(key)}>Remove</button>
            )}
          </div>
        ))}

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <Field label="Add custom setting key" className="mb-0 flex-1 min-w-[200px]">
            <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="e.g. footer_message" />
          </Field>
          <button className="btn-secondary" onClick={addKey} type="button">Add</button>
        </div>

        <div className="mt-6">
          <button className="btn-primary" onClick={onSave} disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button>
        </div>
      </div>
    </div>
  );
}
