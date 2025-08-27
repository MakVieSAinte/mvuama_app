<template>
  <div class="grid gap-6">
    <form>
      <div class="grid gap-2">
        <div class="grid gap-1">
          <UiLabel class="sr-only" for="email"> Email </UiLabel>
          <UiInput
            id="email"
            placeholder="votre@email.com"
            type="email"
            auto-capitalize="none"
            auto-complete="email"
            auto-correct="off"
            v-model="email"
          />
        </div>
        <div class="grid gap-1 mt-2 relative">
          <UiLabel class="sr-only" for="password"> Mot de passe </UiLabel>
          <UiInput
            id="password"
            placeholder="Mot de passe"
            :type="showPassword ? 'text' : 'password'"
            auto-complete="current-password"
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
        <UiButton type="submit" class="mt-4 flex items-center justify-center gap-4 py-3">
          Se connecter
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { Button as UiButton } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { Label as UiLabel } from '@/components/ui/label'

export default defineComponent({
  name: 'LoginForm',
  components: { Eye, EyeOff, UiButton, UiInput, UiLabel },
  data() {
    return {
      showPassword: false,
      email: '',
      password: '',
    }
  },
})
</script>

<style scoped></style>
