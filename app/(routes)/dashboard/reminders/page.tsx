"use client";

import React, { useEffect, useState } from 'react';

type Reminder = {
  id: number;
  user_id: string;
  title: string;
  remind_at: string;
  timezone?: string;
  delivered?: boolean;
  created_at?: string;
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [title, setTitle] = useState('');
  // Helper to produce a value suitable for `<input type="datetime-local" />`
  const toDateTimeLocal = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  // Prefill remindAt with a datetime-local string so users get a simple picker
  const [remindAt, setRemindAt] = useState(() => toDateTimeLocal(new Date()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/reminders');
      const data = await res.json();
      if (data?.success) setReminders(data.reminders || []);
      else setError(data?.error || 'Failed to load reminders');
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    // Client-side validation before sending to server
    if (!title.trim() || !remindAt) {
      setError('Please provide a title and remind time.');
      return;
    }
    // Convert the datetime-local value (local time) into an ISO string
    const parsedDate = new Date(remindAt);
    if (Number.isNaN(parsedDate.getTime())) {
      setError('Please select a valid date and time.');
      return;
    }
    const isoRemindAt = parsedDate.toISOString();
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), remind_at: isoRemindAt }),
      });
      const data = await res.json();
      if (data?.success) {
        setTitle('');
        setRemindAt(toDateTimeLocal(new Date()));
        load();
      } else {
        setError(data?.error || 'Failed to create reminder');
      }
    } catch (e: any) {
      setError(String(e));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Reminders</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="rounded-xl border bg-card text-card-foreground p-6 shadow">
            <h3 className="font-semibold">Create reminder</h3>
            <p className="text-sm text-muted-foreground mt-1">Quickly schedule a reminder with a title and time.</p>

            <form onSubmit={handleCreate} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm">Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="mt-1 input w-full"
                  placeholder="Enter title"
                  autoFocus
                  aria-label="Reminder title"
                />
              </div>
              <div>
                <label className="block text-sm">Remind at</label>
                <input
                  type="datetime-local"
                  value={remindAt}
                  onChange={e => setRemindAt(e.target.value)}
                  className="mt-1 input w-full"
                />
              </div>
              <div>
                <button type="submit" className="btn w-full" disabled={loading || !title.trim() || !remindAt}>Create</button>
              </div>
              {error && <div className="text-red-600">{error}</div>}
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-xl border bg-card text-card-foreground p-6 shadow">
            <h3 className="text-lg font-medium">Your reminders</h3>
            {loading && <div className="mt-3">Loading…</div>}
            {!loading && reminders.length === 0 && <div className="text-sm text-muted-foreground mt-3">No reminders yet.</div>}
            <ul className="space-y-3 mt-4">
              {reminders.map(r => (
                <li key={r.id} className="p-4 rounded-md border bg-background/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{r.title}</div>
                      <div className="text-sm text-muted-foreground">{new Date(r.remind_at).toLocaleString()}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
