<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '@/components/utils/Spinner.vue'

const isLoading = ref(false)
const showPassword = ref(false)
async function onSubmit(event: Event) {
  event.preventDefault()
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 3000)
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
    <span class="bg-background px-2 text-muted-foreground"> Ou continuer avec </span>
  </div>
</div>
 <Button variant="outline" type="button" :disabled="isLoading"> Google </Button>
    <Button variant="outline" type="button" :disabled="isLoading"> Facebook </Button>
  </div>
</template>
