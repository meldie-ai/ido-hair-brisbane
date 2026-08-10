import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyAdminRequest } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  if (!await verifyAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const { label, discount_percent, description, time_window_start, time_window_end, is_active } = await req.json()
    const sql = getDb()
    const [row] = await sql`
      UPDATE promotions
      SET label              = ${label},
          discount_percent   = ${discount_percent},
          description        = ${description},
          time_window_start  = ${time_window_start},
          time_window_end    = ${time_window_end},
          is_active          = ${is_active}
      WHERE id = ${id}
      RETURNING *`
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(row)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!await verifyAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const sql = getDb()
    await sql`DELETE FROM promotions WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
