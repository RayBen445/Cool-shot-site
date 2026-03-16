import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-build-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

if (supabaseUrl === 'https://placeholder-build-url.supabase.co') {
  console.warn('Supabase URL or Anon Key is missing. Check your environment variables. Using placeholder for build.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
