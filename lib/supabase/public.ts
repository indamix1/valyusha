// lib/supabase/public.ts — клієнт Supabase для ПУБЛІЧНОГО читання (без cookies).
// Не читає cookies, тому сторінки, що його використовують, можуть кешуватися
// (ISR). Через RLS анонімний ключ бачить лише активний/опублікований контент.
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
