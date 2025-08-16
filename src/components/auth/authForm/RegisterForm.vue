<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '@/components/utils/Spinner.vue'
import { AuthService } from '@/services/auth/auth'
import { showToast } from '@/plugins/sonner'

const isLoading = ref(false)
const showPassword = ref(false)
const email = ref('')
const password = ref('')

async function onSubmit(event: Event) {
  event.preventDefault()
  isLoading.value = true
  try {
    const { data, error } = await AuthService.signUp(email.value, password.value)
    if (error) {
      showToast({
        title: 'Erreur',
        description: error?.message
          ? String(error.message)
          : 'Erreur lors de la création du compte',
        type: 'error',
      })
    } else {
      showToast({
        title: 'Compte créé',
        description: 'Vérifiez votre email pour valider votre compte.',
        type: 'success',
      })
    }
  } catch (e: any) {
    showToast({
      title: 'Erreur',
      description:
        e && typeof e === 'object' && 'message' in e
          ? String((e as any).message)
          : 'Erreur lors de la création du compte',
      type: 'error',
    })
  } finally {
    isLoading.value = false
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
        <Button :disabled="isLoading" class="mt-4 flex items-center justify-center gap-4 py-3">
          <Spinner v-if="isLoading" size="8px" class="mb-3" />
          <span v-if="!isLoading">S'inscrire avec l'email</span>
          <span v-else>Inscription...</span>
        </Button>
      </div>
    </form>

    <div class="relative my-1">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground"> Ou s'inscrire avec </span>
      </div>
    </div>
    <Button variant="outline" type="button" :disabled="isLoading">
      <svg
        width="900px"
        height="900px"
        class="icon-svg"
        viewBox="-3 0 262 262"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
      >
        <path
          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          fill="#4285F4"
        />
        <path
          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          fill="#34A853"
        />
        <path
          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
          fill="#FBBC05"
        />
        <path
          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          fill="#EB4335"
        />
      </svg>
      Google
    </Button>
    <Button variant="outline" type="button" :disabled="isLoading">
      <svg
        width="900px"
        height="900px"
        class="icon-svg"
        viewBox="0 0 266.895 266.895"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M252.164 266.895c8.134 0 14.729-6.596 14.729-14.73V14.73c0-8.137-6.596-14.73-14.729-14.73H14.73C6.593 0 0 6.594 0 14.73v237.434c0 8.135 6.593 14.73 14.73 14.73h237.434z"
          fill="#485a96"
        />
        <path
          d="M184.152 266.895V163.539h34.692l5.194-40.28h-39.887V97.542c0-11.662 3.238-19.609 19.962-19.609l21.329-.01V41.897c-3.689-.49-16.351-1.587-31.08-1.587-30.753 0-51.807 18.771-51.807 53.244v29.705h-34.781v40.28h34.781v103.355h41.597z"
          fill="#ffffff"
        />
      </svg>
      Facebook
    </Button>
  </div>
</template>

<style>
.icon-svg {
  width: 16px !important;
}
</style>
