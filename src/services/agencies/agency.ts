import supabase, { supabase as client } from '@/services/config/supabaseClient'

export type CreateAgencyInput = {
  name: string
  description?: string
  address?: string
  logo_url?: string
  contact_email?: string
  contact_phone?: string
  website?: string
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await client.auth.getUser()
  return data.user?.id ?? null
}

export async function ensurePublicUserRow() {
  const userId = await getCurrentUserId()
  if (!userId) return null
  // Vérifie si l'utilisateur existe dans public.users, sinon crée une ligne minimale
  const { data: existing } = await client.from('users').select('id').eq('id', userId).maybeSingle()
  if (!existing) {
    await client.from('users').insert({ id: userId }).select('id').maybeSingle()
  }
  return userId
}

export async function createAgency(input: CreateAgencyInput) {
  const userId = await ensurePublicUserRow()
  if (!userId) throw new Error('Non authentifié')
  const payload = { ...input, created_by: userId }
  const { data, error } = await client.from('agencies').insert(payload).select('*').single()
  if (error) throw error
  return data
}

export async function addAdminMembership(agencyId: string) {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Non authentifié')
  const { data, error } = await client
    .from('memberships')
    .insert({ user_id: userId, agency_id: agencyId, role: 'admin' })
    .select('id')
    .single()
  if (error) throw error
  return data
}

export async function getFirstMembershipAgency() {
  const userId = await getCurrentUserId()
  if (!userId) return null
  const { data: memberships, error } = await client
    .from('memberships')
    .select('agency_id')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .limit(1)
  if (error) return null
  if (!memberships || memberships.length === 0) return null
  const agencyId = memberships[0].agency_id
  const { data: agency } = await client
    .from('agencies')
    .select('id,name')
    .eq('id', agencyId)
    .single()
  return agency ?? null
}
