import supabase from '../config/supabaseClient'
import type { IUserProfileModel, IUserProfileUpdateData } from '@/interfaces/userProfileInterface'
import { useUserStore } from '@/stores/userStore'

export class UserService {
  /**
   * Récupère les informations de l'utilisateur actuellement connecté
   * @returns Les informations de l'utilisateur ou null si non connecté
   */
  static async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data.user
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error)
      return null
    }
  }

  /**
   * Récupère le profil complet de l'utilisateur connecté
   * @returns Profil complet de l'utilisateur ou null si non connecté
   */
  static async getUserProfile() {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      // Utilise la table users au lieu de profiles
      const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single()

      if (error) {
        console.error('Erreur SQL:', error)
        throw error
      }

      // Transforme les données au format IUserProfileModel
      const userProfile: IUserProfileModel = {
        id: data.id,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        email: data.email,
        phone: data.phone_number,
        address: null, // Ces champs ne sont pas dans la table users
        city: null,
        state: null,
        zip: null,
        country: data.country,
        currency: data.currency || 'CDF', // Ajout de la devise avec CDF par défaut
        bio: null,
        avatar_url: user.user_metadata?.avatar_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }

      return userProfile
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error)
      return null
    }
  }

  /**
   * Met à jour le profil utilisateur
   * @param profileData Données du profil à mettre à jour
   * @returns Le profil mis à jour ou null en cas d'erreur
   */
  static async updateUserProfile(profileData: IUserProfileUpdateData) {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      // Utilisation directe des champs first_name et last_name
      const userData = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone_number: profileData.phone,
        country: profileData.country,
        currency: profileData.currency, // Ajout de la devise
        updated_at: new Date().toISOString(),  
      }

      // Mise à jour dans la table users
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      // Mettre également à jour les métadonnées utilisateur pour l'avatar
      if (profileData.avatar_url) {
        await supabase.auth.updateUser({
          data: { avatar_url: profileData.avatar_url },
        })
      }

      // Transforme les données au format IUserProfileModel pour le retour
      const userProfile: IUserProfileModel = {
        id: data.id,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        email: data.email,
        phone: data.phone_number,
        address: profileData.address || null,
        city: profileData.city || null,
        state: profileData.state || null,
        zip: profileData.zip || null,
        country: data.country,
        currency: data.currency, // Ajout de la devise retournée
        bio: profileData.bio || null,
        avatar_url: profileData.avatar_url || user.user_metadata?.avatar_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }

      // Mettre à jour le store utilisateur
      const userStore = useUserStore()
      userStore.updateUserProfile(userProfile)

      return userProfile
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil utilisateur:', error)
      return null
    }
  }

  /**
   * Met à jour l'avatar de l'utilisateur
   * @param file Fichier image à télécharger
   * @returns URL de l'avatar mis à jour ou null en cas d'erreur
   */
  static async updateAvatar(file: File) {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Vérifier d'abord si le bucket existe
      const { data: buckets } = await supabase.storage.listBuckets()

      const bucketExists = buckets?.some((bucket) => bucket.name === 'avatars')

      if (!bucketExists) {
        console.warn("Le bucket 'avatars' n'existe pas, utilisation du bucket par défaut")
        // On utilise un bucket existant ou on en crée un temporairement
        const bucketName = buckets && buckets.length > 0 ? buckets[0].name : 'avatars'

        // Upload du fichier dans le bucket disponible
        const { error: uploadError, data } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, { upsert: true })

        if (uploadError) throw uploadError

        // Récupération de l'URL publique
        const { data: publicURL } = supabase.storage.from(bucketName).getPublicUrl(filePath)

        // Mise à jour des métadonnées utilisateur avec la nouvelle URL
        await supabase.auth.updateUser({
          data: { avatar_url: publicURL.publicUrl },
        })

        return publicURL.publicUrl
      } else {
        // Upload du fichier dans le bucket avatars
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true })

        if (uploadError) throw uploadError

        // Récupération de l'URL publique
        const { data: publicURL } = supabase.storage.from('avatars').getPublicUrl(filePath)

        // Mise à jour des métadonnées utilisateur avec la nouvelle URL
        await supabase.auth.updateUser({
          data: { avatar_url: publicURL.publicUrl },
        })

        return publicURL.publicUrl
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar:", error)
      return null
    }
  }

  /**
   * Récupère les informations formatées de l'utilisateur pour l'affichage
   * @returns Un objet contenant le nom complet, l'email et l'avatar de l'utilisateur
   */
  static async getUserDisplayInfo() {
    try {
      // Vérifier si le store utilisateur a déjà les données
      const userStore = useUserStore()
      if (userStore.currentUser) {
        return {
          name: userStore.userName,
          firstName: userStore.userFirstName,
          lastName: userStore.userLastName,
          email: userStore.userEmail,
          avatar: userStore.userAvatar,
        }
      }

      // Si pas dans le store, récupérer le profil complet
      const profile = await this.getUserProfile()

      // Si le profil existe, utiliser ces données
      if (profile) {
        // Mettre à jour le store avec ces données
        userStore.updateUserProfile(profile)

        return {
          name: profile.full_name || 'Utilisateur',
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: profile.email || '',
          avatar: profile.avatar_url || null,
        }
      }

      // Fallback aux données d'authentification si le profil n'est pas disponible
      const user = await this.getCurrentUser()
      if (!user) return null

      const firstName = user.user_metadata?.first_name || ''
      const lastName = user.user_metadata?.last_name || ''
      const fullName = `${firstName} ${lastName}`.trim()

      const displayName =
        fullName || user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur'

      return {
        name: displayName,
        firstName: firstName || '',
        lastName: lastName || '',
        email: user.email || '',
        avatar: user.user_metadata?.avatar_url || null,
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error)
      return null
    }
  }
}
