import { createClient } from '@supabase/supabase-js'

// Using Vite's import.meta.env, but aliasing NEXT_PUBLIC_ for compatibility if needed.
// To use standard React/Vite envs:
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
