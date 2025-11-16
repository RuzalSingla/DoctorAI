"use client";

import React, { useEffect, useState } from 'react';

type Appointment = {
  id: number;
  user_id: string;
  title: string;
  scheduled_at: string;
  notes?: string;
  status?: string;
  created_at?: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [title, setTitle] = useState('');
  // Helper to produce a value suitable for `<input type="datetime-local" />`
  const toDateTimeLocal = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const [scheduledAt, setScheduledAt] = useState(() => toDateTimeLocal(new Date()));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (data?.success) setAppointments(data.appointments || []);
      else setError(data?.error || 'Failed to load appointments');
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
    // Validate title and scheduledAt
    if (!title.trim() || !scheduledAt) {
      setError('Please provide a title and scheduled time.');
      return;
    }
    const parsedDate = new Date(scheduledAt);
    if (Number.isNaN(parsedDate.getTime())) {
      setError('Please select a valid date and time.');
      return;
    }
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), scheduled_at: parsedDate.toISOString(), notes }),
      });
      const data = await res.json();
      if (data?.success) {
        setTitle('');
        setScheduledAt(toDateTimeLocal(new Date()));
        setNotes('');
        load();
      } else {
        setError(data?.error || 'Failed to create appointment');
      }
    } catch (e: any) {
      setError(String(e));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Appointments</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="rounded-xl border bg-card text-card-foreground p-6 shadow">
            <h3 className="font-semibold">Schedule appointment</h3>
            <p className="text-sm text-muted-foreground mt-1">Add title, date/time and optional notes.</p>

            <form onSubmit={handleCreate} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm">Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="mt-1 input w-full"
                  placeholder="Enter title"
                  autoFocus
                  aria-label="Appointment title"
                />
              </div>
              <div>
                <label className="block text-sm">Scheduled at</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  className="mt-1 input w-full"
                />
              </div>
              <div>
                <label className="block text-sm">Notes</label>
                <input value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 input w-full" />
              </div>
              <div>
                <button type="submit" className="btn w-full" disabled={loading || !title.trim() || !scheduledAt}>Create</button>
              </div>
              {error && <div className="text-red-600">{error}</div>}
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-xl border bg-card text-card-foreground p-6 shadow">
            <h3 className="text-lg font-medium">Your appointments</h3>
            {loading && <div className="mt-3">Loading…</div>}
            {!loading && appointments.length === 0 && <div className="text-sm text-muted-foreground mt-3">No appointments yet.</div>}
            <ul className="space-y-3 mt-4">
              {appointments.map(a => (
                <li key={a.id} className="p-4 rounded-md border bg-background/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{a.title}</div>
                      <div className="text-sm text-muted-foreground">{new Date(a.scheduled_at).toLocaleString()}</div>
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
