import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { verifyAdminRequest } from '@/lib/auth'

export async function GET() {
  const db = getSupabase()
  const { data, error } = await db.from('announcement').select('*').limit(1).single()
  if (error) return NextResponse.json(null)
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  if (!await verifyAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = getSupabase()
  // Always operate on the single row — upsert by id if provided, else get first row
  const { data: existing } = await db.from('announcement').select('id').limit(1).single()
  let result
  if (existing) {
    result = await db.from('announcement').update(body).eq('id', existing.id).select().single()
  } else {
    result = await db.from('announcement').insert(body).select().single()
  }
  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json(result.data)
}
