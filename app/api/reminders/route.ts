import { NextResponse } from 'next/server';
import { db } from '../../../config/db';
import { reminders } from '../../../db/schema';
import { asc } from 'drizzle-orm';

type ReminderBody = {
  user_id?: string;
  title: string;
  remind_at: string; // ISO string or parsable
  timezone?: string;
};

export async function GET() {
  try {
      // Some adapters may generate SQL that fails for ORDER BY; fetch without ordering
      // and sort in JS to avoid DB errors (safest compatibility approach).
      const rows = await db.select().from(reminders);
      const sorted = rows.slice().sort((a, b) => {
        const ta = new Date(a.remind_at).getTime();
        const tb = new Date(b.remind_at).getTime();
        return ta - tb;
      });
      return NextResponse.json({ success: true, reminders: sorted });
  } catch (err) {
    console.error('[reminders] GET error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: ReminderBody = await req.json();
    if (!body.title || !body.remind_at) {
      return NextResponse.json({ success: false, error: 'Missing title or remind_at' }, { status: 400 });
    }

    const remindIso = new Date(body.remind_at).toISOString();

    const inserted = await db
      .insert(reminders)
      .values({
        user_id: body.user_id ?? 'anonymous',
        title: body.title,
        remind_at: remindIso,
        timezone: body.timezone ?? 'UTC',
      })
      .returning();

    return NextResponse.json({ success: true, reminder: inserted[0] });
  } catch (err) {
    console.error('[reminders] POST error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
