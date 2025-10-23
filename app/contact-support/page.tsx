"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactSupportPage() {
  const [status, setStatus] = useState<'idle'|'sending'|'sent'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    // Simulate submission delay
    await new Promise((r) => setTimeout(r, 800));
    setStatus('sent');
  }

  return (
    <div className="min-h-screen bg-[#071226] py-12 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-slate-100">Contact Support</h1>
          <Link href="/" className="text-sm text-slate-300 underline">Back to home</Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="col-span-2 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/60 p-8 shadow-lg">
            {status === 'sent' ? (
              <div className="rounded-lg bg-green-800/60 p-6 text-green-100">
                <h2 className="font-semibold">Message sent</h2>
                <p className="mt-1 text-sm text-green-100/90">Thanks — our support team will reply to your email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Email</label>
                  <input name="email" type="email" required className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@hospital.org" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Subject</label>
                  <input name="subject" required className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Short summary" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Message</label>
                  <textarea name="message" rows={6} required className="w-full resize-none rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe the issue in detail..." />
                </div>

                <div className="flex items-center gap-3">
                  <button disabled={status === 'sending'} type="submit" className="inline-flex items-center rounded-md bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow">
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>
                  <Link href="/" className="text-sm text-slate-300 underline">Cancel</Link>
                </div>
              </form>
            )}
          </div>

          <aside className="rounded-2xl bg-slate-800/60 p-6 text-slate-200 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold">Support options</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <strong>Email:</strong> <a className="underline text-slate-100" href="mailto:support@medivoice.ai">support@medivoice.ai</a>
              </li>
              <li>
                <strong>Docs:</strong> <a className="underline text-slate-100" href="/docs">Read our docs</a>
              </li>
              <li>
                <strong>Billing:</strong> If you’re seeing Clerk billing messages, enable billing in Clerk dashboard.
              </li>
            </ul>

            <div className="mt-6 border-t border-slate-700 pt-4 text-xs text-slate-400">
              <p>Response times are usually within 24 hours.</p>
              <p className="mt-2">For urgent issues include server logs and reproduction steps in your message.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
