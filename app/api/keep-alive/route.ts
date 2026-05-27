import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // A tiny query to wake up the Supabase database
    const { data, error } = await supabase.from('sleep_logs').select('id').limit(1)

    // Ignore RLS errors or empty data, the point is just that the query executed
    return NextResponse.json({ status: 'Database pinged successfully', time: new Date().toISOString() })
  } catch (error: any) {
    return NextResponse.json({ status: 'Error pinging database', error: error.message }, { status: 500 })
  }
}
