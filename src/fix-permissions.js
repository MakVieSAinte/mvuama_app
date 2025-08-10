import { AuthService } from './services/auth/authService'
import { supabase } from './services/config/supabaseClient'

// Script pour afficher les informations de l'utilisateur actuel
// et créer un membership admin si nécessaire

async function checkUserAndAddRole() {
  // Vérifier si l'utilisateur est connecté
  const session = await AuthService.getCurrentSession()
  if (!session) {
    console.error("Aucun utilisateur connecté. Veuillez vous connecter d'abord.")
    return
  }

  console.log('User ID:', session.user.id)
  console.log('User Email:', session.user.email)

  // Récupérer les memberships actuels de l'utilisateur
  const { data: memberships, error: membershipError } = await supabase
    .from('memberships')
    .select('*')
    .eq('user_id', session.user.id)
    .is('deleted_at', null)

  if (membershipError) {
    console.error('Erreur lors de la récupération des memberships:', membershipError.message)
    return
  }

  console.log('Memberships actuels:', memberships)

  // Vérifier si l'utilisateur a déjà un membership pour l'agence
  const agencyId = '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15'
  const hasMembership = memberships?.some(m => m.agency_id === agencyId)

  if (hasMembership) {
    console.log("L'utilisateur a déjà un membership pour cette agence")
    
    // Mettre à jour le rôle existant en admin
    const { data: updateData, error: updateError } = await supabase
      .from('memberships')
      .update({ role: 'admin' })
      .eq('user_id', session.user.id)
      .eq('agency_id', agencyId)
      .select()

    if (updateError) {
      console.error('Erreur lors de la mise à jour du rôle:', updateError.message)
    } else {
      console.log('Rôle mis à jour avec succès:', updateData)
    }
  } else {
    // Créer un nouveau membership avec le rôle admin
    const { data: insertData, error: insertError } = await supabase
      .from('memberships')
      .insert({
        user_id: session.user.id,
        agency_id: agencyId,
        role: 'admin'
      })
      .select()

    if (insertError) {
      console.error("Erreur lors de la création du membership:", insertError.message)
    } else {
      console.log('Membership créé avec succès:', insertData)
    }
  }
}

// Exécuter la fonction
checkUserAndAddRole()
