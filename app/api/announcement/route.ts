import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyAdminRequest } from '@/lib/auth'

export async function GET() {
  try {
    const sql = getDb()
    const [row] = await sql`SELECT * FROM announcement LIMIT 1`
    return NextResponse.json(row ?? null)
  } catch {
    return NextResponse.json(null)
  }
}

export async function PUT(req: NextRequest) {
  if (!await verifyAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { message_text, is_active } = await req.json()
    const sql = getDb()

    // Always operate on the single row — upsert by id if one exists
    const [existing] = await sql`SELECT id FROM announcement LIMIT 1`
    let row
    if (existing) {
      ;[row] = await sql`
        UPDATE announcement
        SET message_text = ${message_text}, is_active = ${is_active}
        WHERE id = ${existing.id}
        RETURNING *`
    } else {
      ;[row] = await sql`
        INSERT INTO announcement (message_text, is_active)
        VALUES (${message_text}, ${is_active})
        RETURNING *`
    }
    return NextResponse.json(row)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
