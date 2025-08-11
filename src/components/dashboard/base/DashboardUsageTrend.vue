<template>
  <div class="mt-6">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Route class="h-5 w-5" />
          Tendance d'utilisation
        </CardTitle>
        <CardDescription>Kilomètres parcourus par la flotte</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold">{{ usageTrend.current.toLocaleString() }} km</p>
            <p class="text-sm text-muted-foreground">Ce mois-ci</p>
          </div>
          <div class="text-right">
            <p
              class="text-sm font-medium"
              :class="usageTrend.growth >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ usageTrend.growth >= 0 ? '+' : '' }}{{ usageTrend.growth }}%
            </p>
            <p class="text-xs text-muted-foreground">vs mois dernier</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2">
          <div v-for="(month, index) in months" :key="month" class="text-center">
            <div class="h-16 bg-muted rounded-sm mb-1 flex items-end justify-center p-1">
              <div
                class="bg-primary rounded-sm w-full transition-all"
                :style="{
                  height: (kmData[index] / Math.max(...kmData)) * 100 + '%',
                }"
              ></div>
            </div>
            <p class="text-xs text-muted-foreground">{{ month }}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Route } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface UsageTrend {
  current: number
  previous: number
  growth: number
}

export default defineComponent({
  name: 'DashboardUsageTrend',
  components: {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Route,
  },
  props: {
    usageTrend: {
      type: Object as PropType<UsageTrend>,
      required: true,
    },
    months: {
      type: Array as PropType<string[]>,
      required: true,
    },
    kmData: {
      type: Array as PropType<number[]>,
      required: true,
    },
  },
})
</script>
