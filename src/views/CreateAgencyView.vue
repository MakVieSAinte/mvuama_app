<template>
  <div class="flex h-screen">
    <div class="w-full flex flex-col">
      <div class="w-full flex justify-center pt-8">
        <div class="flex flex-col items-center">
          <img alt="Logo" class="h-20 mb-6" src="@/assets/images/login-background.svg" />

          <div class="w-full px-4 sm:px-6">
            <div class="mx-auto w-full sm:max-w-lg">
              <div class="space-y-2 mb-4 text-center">
                <h1 class="text-2xl font-semibold tracking-tight">Bienvenue sur MVUAMA</h1>
                <p class="text-sm text-muted-foreground">
                  Pour commencer, créez votre première agence
                </p>
              </div>

              <div class="bg-card rounded-lg border shadow-sm p-6">
                <CreateAgencyForm @created="handleAgencyCreated" @cancel="handleCancel" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useSonner } from '@/plugins/sonner'
import CreateAgencyForm from '@/components/agencies/CreateAgencyForm.vue'

export default {
  name: 'CreateAgencyView',
  components: {
    CreateAgencyForm,
  },
  setup() {
    const router = useRouter()
    const { toast } = useSonner()

    const handleAgencyCreated = (agency) => {
      toast.success(`L'agence ${agency.name} a été créée avec succès !`)
      // Stockage de l'ID de l'agence dans le localStorage pour y accéder facilement
      localStorage.setItem('current_agency_id', agency.id)
      localStorage.setItem('current_agency_name', agency.name)
      // Redirection vers le dashboard avec l'ID de l'agence
      router.push(`/agency/${agency.id}`)
    }

    const handleCancel = () => {
      router.push('/dashboard')
    }

    return {
      handleAgencyCreated,
      handleCancel,
    }
  },
}
</script>
