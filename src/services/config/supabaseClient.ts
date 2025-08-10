import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Récupération des variables d'environnement pour la connexion à Supabase
// Ces variables devraient être dans votre .env ou .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://caqsaldkyrqyvkqmjmnz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcXNhbGRreXJxeXZrcW1qbW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4Mzk2NjIsImV4cCI6MjA3MDQxNTY2Mn0.w5X0s4esmlloIUUGOslH-Pf1NWAqcFZdOZE-BBzXZ2E'

// Création du client Supabase avec typage
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Fonction pour définir un token d'accès personnalisé si nécessaire
export const setSupabaseToken = (token: string) => {
  // Cette fonction peut être utilisée pour configurer un token JWT personnalisé
  // pour les utilisateurs déjà authentifiés ailleurs
  supabase.auth.setSession({
    access_token: token,
    refresh_token: '',
  })
}

export default supabase
