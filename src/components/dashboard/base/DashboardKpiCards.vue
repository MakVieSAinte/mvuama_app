<template>
  <!-- KPI Cards -->
  <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4 my-5">
    <!-- Total Véhicules -->
    <Card>
      <div class="py-0">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Véhicules</CardTitle>
          <Car class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ vehicleStats.total }}</div>
          <p class="text-xs text-muted-foreground">{{ vehicleStats.actifs }} actifs</p>
        </CardContent>
      </div>
    </Card>

    <!-- Recettes du mois -->
    <Card>
      <div class="py-0">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Recettes du mois</CardTitle>
          <TrendingUp class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-green-600">
            {{ formatCurrency(monthlyRevenue) }}
          </div>
          <p class="text-xs text-muted-foreground">+{{ revenueGrowth }}% vs mois dernier</p>
        </CardContent>
      </div>
    </Card>

    <!-- Dépenses du mois -->
    <Card>
      <div class="py-0">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Dépenses du mois</CardTitle>
          <TrendingDown class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-red-600">{{ formatCurrency(monthlyExpenses) }}</div>
          <p class="text-xs text-muted-foreground">Entretien, carburant, assurance</p>
        </CardContent>
      </div>
    </Card>

    <!-- Balance financière -->
    <Card>
      <div class="py-0">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Balance</CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold" :class="balance >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ formatCurrency(balance) }}
          </div>
          <p class="text-xs text-muted-foreground">
            {{ balance >= 0 ? 'Bénéfice' : 'Déficit' }} ce mois
          </p>
        </CardContent>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Car, TrendingUp, TrendingDown, DollarSign } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default defineComponent({
  name: 'DashboardKpiCards',
  components: {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Car,
    TrendingUp,
    TrendingDown,
    DollarSign,
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
    monthlyRevenue: {
      type: Number,
      required: true,
    },
    monthlyExpenses: {
      type: Number,
      required: true,
    },
    revenueGrowth: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  methods: {
    formatCurrency(amount: number): string {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount)
    },
  },
})
</script>
