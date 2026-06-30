import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { verifyAdminRequest } from '@/lib/auth'

export async function GET() {
  const db = getSupabase()
  const { data, error } = await db.from('business_hours').select('*').order('day_of_week')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// Expects { hours: Array<{ id, day_of_week, open_time, close_time, is_closed }> }
export async function PUT(req: NextRequest) {
  if (!await verifyAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { hours } = await req.json()
  const db = getSupabase()
  const { error } = await db.from('business_hours').upsert(hours, { onConflict: 'day_of_week' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
