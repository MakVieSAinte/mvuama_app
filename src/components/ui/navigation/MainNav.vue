<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <router-link to="/" class="text-xl font-bold text-primary"> MVUAMA </router-link>

          <div class="hidden md:flex space-x-4">
            <router-link
              to="/profile"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{
                'bg-primary/10 text-primary': $route.path === '/profile',
                'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white':
                  $route.path !== '/profile',
              }"
            >
              Profil
            </router-link>

            <router-link
              to="/subscription"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{
                'bg-primary/10 text-primary': $route.path === '/subscription',
                'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white':
                  $route.path !== '/subscription',
              }"
            >
              Abonnement
            </router-link>

            <router-link
              to="/notifications"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{
                'bg-primary/10 text-primary': $route.path === '/notifications',
                'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white':
                  $route.path !== '/notifications',
              }"
            >
              Notifications
            </router-link>

            <router-link
              to="/"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Retour au Dashboard
            </router-link>
          </div>
        </div>

        <div class="flex items-center">
          <button
            type="button"
            @click="toggleTheme"
            class="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            <svg
              v-if="isDarkMode"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          </button>

          <div class="ml-4 relative">
            <div>
              <button
                type="button"
                @click="isUserMenuOpen = !isUserMenuOpen"
                class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <span class="sr-only">Ouvrir le menu utilisateur</span>
                <img
                  class="h-8 w-8 rounded-full"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="Avatar utilisateur"
                />
              </button>
            </div>

            <div
              v-if="isUserMenuOpen"
              @click.outside="isUserMenuOpen = false"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            >
              <router-link
                to="/profile"
                @click="isUserMenuOpen = false"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Votre profil
              </router-link>

              <router-link
                to="/subscription"
                @click="isUserMenuOpen = false"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Abonnement
              </router-link>

              <router-link
                to="/notifications"
                @click="isUserMenuOpen = false"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Notifications
              </router-link>

              <div class="border-t border-gray-200 dark:border-gray-700"></div>

              <a
                href="#"
                @click.prevent="logout"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Se déconnecter
              </a>
            </div>
          </div>

          <div class="ml-4 md:hidden">
            <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <span class="sr-only">Ouvrir le menu principal</span>
              <svg
                v-if="!isMobileMenuOpen"
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                v-else
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Menu mobile -->
      <div v-if="isMobileMenuOpen" class="md:hidden pt-4 pb-3 space-y-1">
        <router-link
          to="/profile"
          @click="isMobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium transition-colors"
          :class="{
            'bg-primary/10 text-primary': $route.path === '/profile',
            'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white':
              $route.path !== '/profile',
          }"
        >
          Profil
        </router-link>

        <router-link
          to="/subscription"
          @click="isMobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium transition-colors"
          :class="{
            'bg-primary/10 text-primary': $route.path === '/subscription',
            'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white':
              $route.path !== '/subscription',
          }"
        >
          Abonnement
        </router-link>

        <router-link
          to="/notifications"
          @click="isMobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium transition-colors"
          :class="{
            'bg-primary/10 text-primary': $route.path === '/notifications',
            'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white':
              $route.path !== '/notifications',
          }"
        >
          Notifications
        </router-link>

        <router-link
          to="/"
          @click="isMobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Retour au Dashboard
        </router-link>

        <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

        <a
          href="#"
          @click.prevent="logout"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Se déconnecter
        </a>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/config/supabaseClient'
import { useUserPrefs } from '@/composables/useUserPrefs'

export default defineComponent({
  name: 'MainNav',
  setup() {
    const router = useRouter()
    const isMobileMenuOpen = ref(false)
    const isUserMenuOpen = ref(false)
    const { theme, toggleTheme } = useUserPrefs('user-prefs')

    const isDarkMode = computed(() => {
      return theme.value === 'dark'
    })

    const logout = async () => {
      try {
        await supabase.auth.signOut()
        router.push('/auth/login')
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error)
      }
    }

    return {
      isMobileMenuOpen,
      isUserMenuOpen,
      isDarkMode,
      toggleTheme,
      logout,
    }
  },
})
</script>
