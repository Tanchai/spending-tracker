import { createClient } from '@supabase/supabase-js'

// In dev, Vite reads these from .env.local. On Netlify they're set as
// environment variables in the site dashboard.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
)

export const isSupabaseConfigured = () =>
  !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY