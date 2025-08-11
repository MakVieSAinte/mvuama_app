<template>
  <div class="grid gap-6 md:grid-cols-2">
    <!-- Statut des véhicules -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Activity class="h-5 w-5" />
          Statut des Véhicules
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Actifs</span>
          </div>
          <Badge variant="secondary" class="bg-green-100 text-green-800">
            {{ vehicleStats.actifs }}
          </Badge>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <span>En panne</span>
          </div>
          <Badge variant="secondary" class="bg-red-100 text-red-800">
            {{ vehicleStats.enPanne }}
          </Badge>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>En révision</span>
          </div>
          <Badge variant="secondary" class="bg-yellow-100 text-yellow-800">
            {{ vehicleStats.enRevision }}
          </Badge>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Vendus</span>
          </div>
          <Badge variant="secondary" class="bg-gray-100 text-gray-800">
            {{ vehicleStats.vendus }}
          </Badge>
        </div>
      </CardContent>
    </Card>

    <!-- Répartition par type -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <BarChart3 class="h-5 w-5" />
          Répartition par Type
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <div
          v-for="[type, count] in Object.entries(vehicleTypeStats)"
          :key="type"
          class="flex items-center justify-between"
        >
          <span class="capitalize">{{ type }}s</span>
          <Badge variant="outline">{{ count }}</Badge>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Activity, BarChart3 } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default defineComponent({
  name: 'DashboardVehicleStatus',
  components: {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Badge,
    Activity,
    BarChart3,
  },
  props: {
    vehicleStats: {
      type: Object as PropType<{
        total: number
        actifs: number
        enPanne: number
        enRevision: number
        vendus: number
      }>,
      required: true,
    },
    vehicleTypeStats: {
      type: Object as PropType<Record<string, number>>,
      required: true,
    },
  },
})
</script>
