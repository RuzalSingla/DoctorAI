import { NextResponse } from 'next/server';
import { db } from '../../../config/db';
import { appointments } from '../../../db/schema';
import { asc } from 'drizzle-orm';

type AppointmentBody = {
  user_id?: string;
  title: string;
  scheduled_at: string; // ISO string
  notes?: string;
};

export async function GET() {
  try {
    // Avoid ORDER BY SQL generation issues by sorting in JS after fetching rows.
    const rows = await db.select().from(appointments);
    const sorted = rows.slice().sort((a, b) => {
      const ta = new Date(a.scheduled_at).getTime();
      const tb = new Date(b.scheduled_at).getTime();
      return ta - tb;
    });
    return NextResponse.json({ success: true, appointments: sorted });
  } catch (err) {
    console.error('[appointments] GET error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: AppointmentBody = await req.json();
    if (!body.title || !body.scheduled_at) {
      return NextResponse.json({ success: false, error: 'Missing title or scheduled_at' }, { status: 400 });
    }

    const scheduledIso = new Date(body.scheduled_at).toISOString();

    const inserted = await db
      .insert(appointments)
      .values({
        user_id: body.user_id ?? 'anonymous',
        title: body.title,
        scheduled_at: scheduledIso,
        notes: body.notes ?? '',
      })
      .returning();

    return NextResponse.json({ success: true, appointment: inserted[0] });
  } catch (err) {
    console.error('[appointments] POST error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
