import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyAdminRequest } from '@/lib/auth'

export async function GET() {
  try {
    const sql = getDb()
    const rows = await sql`SELECT * FROM promotions ORDER BY created_at`
    return NextResponse.json(rows)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!await verifyAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { label, discount_percent, description, time_window_start, time_window_end, is_active } = await req.json()
    const sql = getDb()
    const [row] = await sql`
      INSERT INTO promotions (label, discount_percent, description, time_window_start, time_window_end, is_active)
      VALUES (${label}, ${discount_percent}, ${description}, ${time_window_start}, ${time_window_end}, ${is_active ?? true})
      RETURNING *`
    return NextResponse.json(row)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
