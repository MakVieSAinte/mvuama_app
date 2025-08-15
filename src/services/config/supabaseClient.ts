import { createClient } from '@supabase/supabase-js'
import { config } from '@/services/config/config'

const supabaseUrl = config.base_url_supabase
const supabaseAnonKey = config.base_anon_key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// export const setSupabaseToken = (token: string) => {
//   // Pour un token pour les utilisateurs déjà authentifiés ailleurs
//   supabase.auth.setSession({
//     access_token: token,
//     refresh_token: '',
//   })
// }

export default supabase
