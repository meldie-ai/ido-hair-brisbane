import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyAdminRequest } from '@/lib/auth'

export async function GET() {
  try {
    const sql = getDb()
    const rows = await sql`SELECT * FROM business_hours ORDER BY day_of_week`
    return NextResponse.json(rows)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

// Expects { hours: Array<{ id, day_of_week, open_time, close_time, is_closed }> }
export async function PUT(req: NextRequest) {
  if (!await verifyAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { hours } = await req.json()
    const sql = getDb()
    // Upsert each row individually — Neon tagged-template doesn't support array spread
    for (const h of hours) {
      await sql`
        INSERT INTO business_hours (id, day_of_week, open_time, close_time, is_closed)
        VALUES (${h.id}, ${h.day_of_week}, ${h.open_time}, ${h.close_time}, ${h.is_closed})
        ON CONFLICT (day_of_week)
        DO UPDATE SET open_time = EXCLUDED.open_time,
                      close_time = EXCLUDED.close_time,
                      is_closed  = EXCLUDED.is_closed`
    }
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
