<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '@/components/utils/Spinner.vue'
import { AuthService } from '@/services/auth/auth'
import { useSonner } from '@/plugins/sonner'
import { useRouter } from 'vue-router'
import { getFirstMembershipAgency, slugify } from '@/services/agencies/agency'

const isLoading = ref(false)
const googleLoading = ref(false)
const facebookLoading = ref(false)
const showPassword = ref(false)
const email = ref('')
const password = ref('')
const { toastError, toastSuccess } = useSonner()
const router = useRouter()

async function onSubmit(event: Event) {
  event.preventDefault()
  isLoading.value = true
  try {
    const data = await AuthService.signIn(email.value, password.value)
    if (!data) {
      return toastError('Identifiants invalides ou erreur de connexion')
    }
    // Connexion réussie -> vérifier l'agence et rediriger
    const agency = await getFirstMembershipAgency()
    toastSuccess('Connexion réussie')
    if (!agency) return router.replace({ name: 'onboarding-agency' })
    return router.replace({ name: 'agency-home', params: { slug: slugify(agency.name) } })
  } catch (e: unknown) {
    toastError(
      e && typeof e === 'object' && 'message' in e
        ? String((e as { message?: string }).message || 'Erreur de connexion')
        : 'Erreur de connexion',
    )
  } finally {
    isLoading.value = false
  }
}

async function handleGoogleSignIn() {
  googleLoading.value = true
  try {
    const { error } = await AuthService.signInWithGoogle()
    if (error) {
      toastError(error?.message ? String(error.message) : 'Erreur Google OAuth')
    }
    // Redirection gérée par Supabase vers /auth/callback
  } catch (e: unknown) {
    toastError(
      e && typeof e === 'object' && 'message' in e
        ? String((e as { message?: string }).message || 'Erreur Google OAuth')
        : 'Erreur Google OAuth',
    )
  } finally {
    googleLoading.value = false
  }
}

async function handleFacebookSignIn() {
  facebookLoading.value = true
  try {
    const { error } = await AuthService.signInWithFacebook()
    if (error) {
      toastError(error?.message ? String(error.message) : 'Erreur Facebook OAuth')
    }
    // Redirection gérée par Supabase vers /auth/callback
  } catch (e: unknown) {
    toastError(
      e && typeof e === 'object' && 'message' in e
        ? String((e as { message?: string }).message || 'Erreur Facebook OAuth')
        : 'Erreur Facebook OAuth',
    )
  } finally {
    facebookLoading.value = false
  }
}
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <Label class="sr-only" for="email"> Email </Label>
          <Input
            id="email"
            placeholder="votre@email.com"
            type="email"
            auto-capitalize="none"
            auto-complete="email"
            auto-correct="off"
            :disabled="isLoading"
            v-model="email"
          />
        </div>
        <div class="grid gap-1 mt-2 relative">
          <Label class="sr-only" for="password"> Mot de passe </Label>
          <Input
            id="password"
            placeholder="Mot de passe"
            :type="showPassword ? 'text' : 'password'"
            auto-complete="current-password"
            :disabled="isLoading"
            class="pr-10"
            v-model="password"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            tabindex="-1"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
          >
            <Eye v-if="!showPassword" class="w-[17px]" />
            <EyeOff v-else class="w-[17px]" />
          </button>
        </div>
        <Button
          type="submit"
          :disabled="isLoading"
          class="mt-4 flex items-center justify-center gap-4 py-3"
        >
          <Spinner v-if="isLoading" size="8px" class="mb-3" />
          <span v-if="!isLoading">Se connecter avec l'email</span>
          <span v-else>Connexion...</span>
        </Button>
      </div>
    </form>

    <div class="relative my-1">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground"> Ou continuer avec </span>
      </div>
    </div>
    <Button
      variant="outline"
      type="button"
      @click="handleGoogleSignIn"
      :disabled="isLoading || googleLoading"
    >
      <Spinner v-if="googleLoading" size="8px" class="mr-2" />
      <span>Google</span>
    </Button>
    <Button
      variant="outline"
      type="button"
      @click="handleFacebookSignIn"
      :disabled="isLoading || facebookLoading"
    >
      <Spinner v-if="facebookLoading" size="8px" class="mr-2" />
      <span>Facebook</span>
    </Button>
  </div>
</template>
