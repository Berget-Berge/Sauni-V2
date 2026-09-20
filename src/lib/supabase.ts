import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Manglar VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Sjekk .env (lokalt) eller Environment Variables i Vercel.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
