import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  try {
    const { items } = await req.json()
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }
    const { data, error } = await supabase
      .from('pending_carts')
      .insert({ items })
      .select('id')
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ id: data.id })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
