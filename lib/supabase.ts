import { createClient } from '@supabase/supabase-js'

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\n/g, '').replace(/\r/g, '')
const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim().replace(/\n/g, '').replace(/\r/g, '')

export const supabase = createClient(url, key, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    }
  }
})