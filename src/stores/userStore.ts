import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { UserService } from '@/services/user/userService'
import type { IUserProfileModel } from '@/interfaces/userProfileInterface'

export const useUserStore = defineStore('user', () => {
  // État
  const currentUser = ref<IUserProfileModel | null>(null)
  const userLoading = ref(false)
  const lastUpdated = ref(Date.now())

  // Getters
  const isLoggedIn = computed(() => !!currentUser.value)
  const userName = computed(() => {
    if (!currentUser.value) return 'Utilisateur'
    return (
      currentUser.value.full_name ||
      `${currentUser.value.first_name} ${currentUser.value.last_name}`.trim() ||
      currentUser.value.email?.split('@')[0] ||
      'Utilisateur'
    )
  })
  const userFirstName = computed(() => currentUser.value?.first_name || '')
  const userLastName = computed(() => currentUser.value?.last_name || '')
  const userEmail = computed(() => currentUser.value?.email || '')
  const userAvatar = computed(() => currentUser.value?.avatar_url || '')

  // Actions
  async function fetchUserProfile() {
    userLoading.value = true
    try {
      const userData = await UserService.getUserProfile()
      if (userData) {
        currentUser.value = userData
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil utilisateur:', error)
    } finally {
      userLoading.value = false
      lastUpdated.value = Date.now()
    }
  }

  function updateUserProfile(userData: Partial<IUserProfileModel>) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...userData }
      lastUpdated.value = Date.now()
    }
  }

  function clearUserData() {
    currentUser.value = null
    lastUpdated.value = Date.now()
  }

  return {
    currentUser,
    userLoading,
    lastUpdated,
    isLoggedIn,
    userName,
    userFirstName,
    userLastName,
    userEmail,
    userAvatar,
    fetchUserProfile,
    updateUserProfile,
    clearUserData,
  }
})
