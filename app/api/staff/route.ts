import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { verifyAdminRequest } from '@/lib/auth'

export async function GET() {
  const db = getSupabase()
  const { data, error } = await db.from('staff').select('*').order('display_order')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!await verifyAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = getSupabase()
  const { data: maxRow } = await db.from('staff').select('display_order').order('display_order', { ascending: false }).limit(1).single()
  const display_order = (maxRow?.display_order ?? 0) + 1
  const { data, error } = await db.from('staff').insert({ ...body, display_order }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
