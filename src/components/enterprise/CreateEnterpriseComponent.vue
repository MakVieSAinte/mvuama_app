<template>
  <div
    class="container relative min-h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <!-- Lien de retour au dashboard -->
    <button
      @click="handleCancel"
      :class="cn(buttonVariants({ variant: 'ghost' }), 'absolute left-4 top-4 md:left-8 md:top-8')"
    >
      <ArrowLeftIcon class="mr-2 h-4 w-4" />
      Retour
    </button>

    <!-- Partie gauche: cachée sur mobile, visible sur desktop -->
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center text-lg font-medium">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          class="mr-2 h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        <!-- mvuama app -->
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;La création de plusieurs agences m'a permis d'organiser efficacement ma flotte de
            véhicules dans différentes villes. Un vrai plus pour mon entreprise.&rdquo;
          </p>
          <footer class="text-sm">Jean Makosso, Directeur de flotte</footer>
        </blockquote>
      </div>
    </div>

    <!-- Partie droite: formulaire d'inscription (visible sur tous les écrans) -->
    <div class="flex h-full w-full items-center justify-center p-4 sm:p-6 lg:p-8">
      <div
        class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px] md:w-[650px] max-w-[95vw]"
      >
        <div class="flex flex-col space-y-2 text-left">
          <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight">Créer une entreprise</h1>
          <p class="text-sm sm:text-md text-muted-foreground">
            Configurez votre nouvelle entre pour commencer à gérer votre flotte
          </p>
        </div>

        <!-- Logo sur mobile uniquement -->
        <div class="flex items-center justify-center sm:hidden mb-4">
          <div class="flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              class="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <!-- mvuama app -->
          </div>
        </div>

        <!-- Formulaire -->
        <EnterpriseForm @created="handleEnterpriseCreated" @cancel="handleCancel" />

        <p class="px-1 text-center text-xs sm:text-sm text-muted-foreground">
          En cliquant sur continuer, vous acceptez nos
          <a href="/terms" class="underline underline-offset-4 hover:text-primary">
            Conditions d'utilisation
          </a>
          et notre
          <a href="/privacy" class="underline underline-offset-4 hover:text-primary">
            Politique de confidentialité </a
          >.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useSonner } from '@/plugins/sonner'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft as ArrowLeftIcon } from 'lucide-vue-next'
import EnterpriseForm from '@/components/enterprise/enterpriseForm/EntrepriseForm.vue'

export default defineComponent({
  name: 'CreateEnterpriseComponent',
  components: {
    EnterpriseForm,
    ArrowLeftIcon,
  },
  setup() {
    const router = useRouter()
    const { toast } = useSonner()

    const handleEnterpriseCreated = (enterprise) => {
      // Vérifier que l'objet enterprise existe et a les propriétés requises
      if (!enterprise || !enterprise.id || !enterprise.name) {
        console.error("Données d'entreprise invalides:", enterprise)
        toast.error("Une erreur s'est produite lors de la création de l'entreprise")
        return
      }

      toast.success(`L'entreprise ${enterprise.name} a été créée avec succès !`)
      // Stockage de l'ID de l'entreprise dans le localStorage pour y accéder facilement
      localStorage.setItem('current_enterprise_id', enterprise.id)
      localStorage.setItem('current_enterprise_name', enterprise.name)
      // Redirection vers le dashboard avec l'ID de l'entreprise
      router.push(`/enterprise/${enterprise.id}`)
    }

    const handleCancel = () => {
      router.push('/dashboard')
    }

    return {
      handleEnterpriseCreated,
      handleCancel,
      cn,
      buttonVariants,
    }
  },
})
</script>

<style scoped>
/* Styles pour améliorer la réactivité */
@media screen and (max-width: 640px) {
  /* Meilleure adaptation sur mobile */
  :deep(.input),
  :deep(.button) {
    font-size: 0.95rem;
  }
}

@media screen and (max-width: 400px) {
  /* Pour très petits écrans */
  :deep(form) {
    width: 100%;
  }
}
</style>
