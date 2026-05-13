import { createClient } from '@supabase/supabase-js'

// 브라우저용 (공개 키)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)