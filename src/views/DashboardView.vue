<script lang="ts">
import { defineComponent } from 'vue'
import DashboardComponent from '../components/dashboard/DashboardComponent.vue'
import CreateAgencyOverlay from '../components/dashboard/CreateAgencyOverlay.vue'
import { supabase } from '@/services/config/supabaseClient'
import { EnterpriseService } from '@/services/enterprise/enterpriseService'
import { AgencyService } from '@/services/agencies/agencyService'

export default defineComponent({
  components: {
    DashboardComponent,
    CreateAgencyOverlay,
  },
  data() {
    return {
      showAgencyOverlay: false,
      isLoading: true,
      hasAgencies: false,
    }
  },
  async created() {
    await this.checkUserAgencies()
  },
  methods: {
    async checkUserAgencies() {
      try {
        this.isLoading = true

        // Récupérer l'ID de l'utilisateur connecté
        const { data: authData } = await supabase.auth.getUser()
        if (!authData?.user) {
          return
        }

        // Récupérer l'entreprise de l'utilisateur
        const { data: enterprises } = await EnterpriseService.getUserEnterprises(authData.user.id)
        if (!enterprises || enterprises.length === 0) {
          // L'utilisateur n'a pas encore créé d'entreprise
          // Il devrait être redirigé vers /create-enterprise par le middleware
          return
        }

        // Vérifier si l'utilisateur a déjà des agences pour cette entreprise
        const { data: agencies } = await AgencyService.getAgenciesByEnterpriseId(enterprises[0].id)

        this.hasAgencies = agencies && agencies.length > 0

        // Si l'utilisateur n'a pas d'agence, afficher l'overlay
        if (!this.hasAgencies) {
          this.showAgencyOverlay = true
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des agences:', error)
      } finally {
        this.isLoading = false
      }
    },
    handleAgencyCreated() {
      this.hasAgencies = true
      this.showAgencyOverlay = false
      // Recharger le dashboard
      this.$forceUpdate()
    },
    closeOverlay() {
      this.showAgencyOverlay = false
    },
  },
})
</script>

<template>
  <main>
    <DashboardComponent />
    <CreateAgencyOverlay
      :showOverlay="showAgencyOverlay"
      @close="closeOverlay"
      @agency-created="handleAgencyCreated"
    />
  </main>
</template>
