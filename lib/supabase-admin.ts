import { createClient } from '@supabase/supabase-js'

// 서버용 (서비스 롤 키)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)