<template>
  <!-- Alertes importantes -->
  <Alert
    v-if="hasAlerts"
    variant="destructive"
    class="border-2 border-amber-400 bg-gradient-to-r from-amber-100 via-yellow-50 to-white/80 backdrop-blur-sm"
  >
    <AlertTriangle class="h-5 w-5" />
    <AlertTitle class="text-amber-900">Attention requise</AlertTitle>
    <AlertDescription class="mt-3">
      <div class="grid gap-2">
        <div v-if="expiredDocuments.length > 0" class="flex items-center gap-2">
          <div class="h-2 w-2 rounded-full bg-red-500"></div>
          <span class="text-sm">{{ expiredDocuments.length }} document(s) expiré(s)</span>
        </div>
        <div v-if="nearExpiryDocuments.length > 0" class="flex items-center gap-2">
          <div class="h-2 w-2 rounded-full bg-orange-500"></div>
          <span class="text-sm">{{ nearExpiryDocuments.length }} document(s) expirent bientôt</span>
        </div>
        <div v-if="vehiclesInMaintenance > 0" class="flex items-center gap-2">
          <div class="h-2 w-2 rounded-full bg-blue-500"></div>
          <span class="text-sm">{{ vehiclesInMaintenance }} véhicule(s) en maintenance</span>
        </div>
      </div>
    </AlertDescription>
  </Alert>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default defineComponent({
  name: 'DashboardAlerts',
  components: {
    Alert,
    AlertDescription,
    AlertTitle,
    AlertTriangle,
  },
  props: {
    expiredDocuments: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    nearExpiryDocuments: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    vehiclesInMaintenance: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    hasAlerts() {
      return (
        this.expiredDocuments.length > 0 ||
        this.nearExpiryDocuments.length > 0 ||
        this.vehiclesInMaintenance > 0
      )
    },
  },
})
</script>
