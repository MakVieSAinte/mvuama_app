<template>
  <div class="mt-6">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <PieChart class="h-5 w-5" />
          Répartition des dépenses
        </CardTitle>
        <CardDescription>Ventilation des coûts de la flotte</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="[category, amount] in Object.entries(expenseBreakdown)"
            :key="category"
            class="space-y-2"
          >
            <div class="flex items-center justify-between text-sm">
              <span class="capitalize font-medium">{{ category }}</span>
              <span class="text-muted-foreground">{{ formatCurrency(amount) }}</span>
            </div>
            <Progress
              :model-value="
                (amount / Object.values(expenseBreakdown).reduce((a, b) => a + b, 0)) * 100
              "
              class="h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PieChart } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default defineComponent({
  name: 'DashboardExpenseBreakdown',
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
    expenseBreakdown: {
      type: Object as PropType<Record<string, number>>,
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
