<!-- components/dashboard/CreateAgencyOverlay.vue -->
<template>
  <div
    v-if="showOverlay"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm"
  >
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4">Créer une agence</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Avant de commencer à utiliser l'application, vous devez créer une agence pour votre
        entreprise.
      </p>

      <form @submit.prevent="handleCreateAgency">
        <div class="space-y-4">
          <div>
            <label for="agency-name" class="block text-sm font-medium mb-1">Nom de l'agence</label>
            <input
              id="agency-name"
              v-model="agencyName"
              type="text"
              class="w-full p-2 border rounded-md"
              placeholder="Entrez le nom de l'agence"
              required
            />
          </div>

          <div>
            <label for="agency-code" class="block text-sm font-medium mb-1">Code de l'agence</label>
            <input
              id="agency-code"
              v-model="agencyCode"
              type="text"
              class="w-full p-2 border rounded-md"
              placeholder="Code unique pour cette agence"
            />
          </div>

          <div>
            <label for="agency-address" class="block text-sm font-medium mb-1">Adresse</label>
            <input
              id="agency-address"
              v-model="agencyAddress"
              type="text"
              class="w-full p-2 border rounded-md"
              placeholder="Adresse de l'agence"
            />
          </div>

          <div class="flex space-x-4">
            <div class="flex-1">
              <label for="agency-city" class="block text-sm font-medium mb-1">Ville</label>
              <input
                id="agency-city"
                v-model="agencyCity"
                type="text"
                class="w-full p-2 border rounded-md"
                placeholder="Ville"
              />
            </div>

            <div class="flex-1">
              <label for="agency-postal-code" class="block text-sm font-medium mb-1"
                >Code postal</label
              >
              <input
                id="agency-postal-code"
                v-model="agencyPostalCode"
                type="text"
                class="w-full p-2 border rounded-md"
                placeholder="Code postal"
              />
            </div>
          </div>

          <div>
            <label for="agency-phone" class="block text-sm font-medium mb-1">Téléphone</label>
            <input
              id="agency-phone"
              v-model="agencyPhone"
              type="tel"
              class="w-full p-2 border rounded-md"
              placeholder="Numéro de téléphone"
            />
          </div>

          <div>
            <label for="agency-email" class="block text-sm font-medium mb-1"
              >Email de contact</label
            >
            <input
              id="agency-email"
              v-model="agencyEmail"
              type="email"
              class="w-full p-2 border rounded-md"
              placeholder="Email de contact"
            />
          </div>
        </div>

        <div class="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            @click="closeOverlay"
            class="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Plus tard
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Création en cours...</span>
            <span v-else>Créer l'agence</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { supabase } from '@/services/config/supabaseClient'
import { AgencyService } from '@/services/agencies/agencyService'
import { EnterpriseService } from '@/services/enterprise/enterpriseService'

export default defineComponent({
  name: 'CreateAgencyOverlay',
  props: {
    showOverlay: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'agency-created'],
  data() {
    return {
      agencyName: '',
      agencyCode: '',
      agencyAddress: '',
      agencyCity: '',
      agencyPostalCode: '',
      agencyPhone: '',
      agencyEmail: '',
      isLoading: false,
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('close')
    },
    async handleCreateAgency() {
      if (!this.agencyName) {
        alert("Le nom de l'agence est obligatoire")
        return
      }

      this.isLoading = true

      try {
        // Récupérer l'ID de l'utilisateur connecté
        const { data: authData } = await supabase.auth.getUser()
        if (!authData?.user) {
          throw new Error('Utilisateur non connecté')
        }

        // Récupérer l'entreprise de l'utilisateur
        const { data: enterprises } = await EnterpriseService.getUserEnterprises(authData.user.id)
        if (!enterprises || enterprises.length === 0) {
          throw new Error('Aucune entreprise trouvée')
        }

        // Créer l'agence
        const agencyData = {
          name: this.agencyName,
          code: this.agencyCode,
          enterprise_id: enterprises[0].id,
          address: this.agencyAddress,
          city: this.agencyCity,
          postal_code: this.agencyPostalCode,
          phone: this.agencyPhone,
          email: this.agencyEmail,
          created_by: authData.user.id,
        }

        const { success, error } = await AgencyService.createAgency(agencyData)

        if (!success || error) {
          throw error || new Error("Erreur lors de la création de l'agence")
        }

        // Notifier le parent que l'agence a été créée
        this.$emit('agency-created')

        // Réinitialiser le formulaire
        this.agencyName = ''
        this.agencyCode = ''
        this.agencyAddress = ''
        this.agencyCity = ''
        this.agencyPostalCode = ''
        this.agencyPhone = ''
        this.agencyEmail = ''

        // Fermer l'overlay après un court délai
        setTimeout(() => {
          this.$emit('close')
        }, 500)
      } catch (error) {
        console.error("Erreur lors de la création de l'agence:", error)
        alert("Une erreur est survenue lors de la création de l'agence")
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>
