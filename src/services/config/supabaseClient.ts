import { createClient } from '@supabase/supabase-js'
import { config } from '@/services/config/config'
import type { Database } from '@/types/supabase'

const supabaseUrl = config.base_url_supabase
const supabaseAnonKey = config.base_anon_key

// Création du client Supabase avec typage
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export const setSupabaseToken = (token: string) => {
  // Pour un token pour les utilisateurs déjà authentifiés ailleurs
  supabase.auth.setSession({
    access_token: token,
    refresh_token: '',
  })
}

export default supabase
