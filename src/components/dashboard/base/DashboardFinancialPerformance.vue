<template>
  <div class="mt-6">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <PieChart class="h-5 w-5" />
          Performance Financière
        </CardTitle>
        <CardDescription>Évolution des finances ce mois</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Recettes</span>
              <span class="font-medium text-green-600">{{ formatCurrency(monthlyRevenue) }}</span>
            </div>
            <Progress :model-value="revenueProgress" class="h-2" />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Dépenses</span>
              <span class="font-medium text-red-600">{{ formatCurrency(monthlyExpenses) }}</span>
            </div>
            <Progress :model-value="expenseProgress" class="h-2" />
          </div>
        </div>
        <div class="pt-4 border-t">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Bénéfice Net</span>
            <span
              class="text-lg font-bold"
              :class="balance >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ formatCurrency(balance) }}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PieChart } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default defineComponent({
  name: 'DashboardFinancialPerformance',
  components: {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Progress,
    PieChart,
  },
  props: {
    monthlyRevenue: {
      type: Number,
      required: true,
    },
    monthlyExpenses: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    revenueProgress: {
      type: Number,
      required: true,
    },
    expenseProgress: {
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
