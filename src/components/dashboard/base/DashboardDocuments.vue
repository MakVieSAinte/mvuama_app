<template>
  <div class="mt-6">
    <Card v-if="documentsToExpire.length > 0">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <FileText class="h-5 w-5" />
          Documents à renouveler
        </CardTitle>
        <CardDescription>
          Documents expirés ou expirant dans les 30 prochains jours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div
            v-for="doc in documentsToExpire.slice(0, 5)"
            :key="doc.id"
            class="flex items-center justify-between p-3 border rounded-lg mb-3"
          >
            <div class="flex-1">
              <p class="font-medium">{{ doc.vehicleInfo }} - {{ doc.type }}</p>
              <p class="text-sm text-muted-foreground">
                Échéance: {{ formatDate(doc.dateExpiration) }}
              </p>
            </div>
            <Badge
              :variant="doc.isExpired ? 'destructive' : 'secondary'"
              :class="doc.isExpired ? '' : 'bg-orange-100 text-orange-800'"
            >
              {{ doc.isExpired ? 'Expiré' : `${doc.daysUntilExpiry}j` }}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { FileText } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Document {
  id: number
  vehicleInfo: string
  type: string
  dateExpiration: string
  isExpired: boolean
  daysUntilExpiry: number
}

export default defineComponent({
  name: 'DashboardDocuments',
  components: {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Badge,
    FileText,
  },
  props: {
    documentsToExpire: {
      type: Array as PropType<Document[]>,
      default: () => [],
    },
  },
  methods: {
    formatDate(dateString: string): string {
      return new Date(dateString).toLocaleDateString('fr-FR')
    },
  },
})
</script>
