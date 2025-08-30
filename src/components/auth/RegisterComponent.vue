<template>
  <div
    class="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <router-link :to="{ name: 'login' }" :class="cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 md:right-8 md:top-8')
      ">
      Connexion
    </router-link>
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center text-lg font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" class="mr-2 h-6 w-6">
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        mvuama app
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;l'inscription de mes chauffeurs et la gestion des documents sont devenues ultra
            simples. Je recommande à tous les gestionnaires de flotte !&rdquo;
          </p>
          <footer class="text-sm">Sofia Yanghat</footer>
        </blockquote>
      </div>
    </div>
    <div class="flex h-full w-full items-center justify-center p-6 lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div class="flex flex-col space-y-2 text-left">
          <h1 class="text-4xl font-semibold tracking-tight">Créer un compte</h1>
          <p class="text-md text-muted-foreground">
            Veuillez renseigner les champs ci-dessous pour créer votre compte
          </p>
        </div>
        <RegisterForm />
        <p class="px-1 text-center text-sm text-muted-foreground">
          En cliquant sur continuer, vous acceptez nos
          <a href="/terms" class="underline underline-offset-4 hover:text-primary">
            Conditions d'utilisation
          </a>
          et notre
          <a href="/privacy" class="underline underline-offset-4 hover:text-primary">
            Politique de confidentialité
          </a>
          .
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import RegisterForm from '@/components/auth/authForm/RegisterForm.vue'

export default defineComponent({
  name: 'RegisterComponent',
  components: { RegisterForm },
  methods: {
    cn,
    buttonVariants,
  },
})
</script>

<style scoped></style>
