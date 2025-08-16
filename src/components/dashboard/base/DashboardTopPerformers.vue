<template>
  <div class="grid gap-6 md:grid-cols-2 mt-6">
    <!-- Top 5 véhicules les plus rentables -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Trophy class="h-5 w-5" />
          Top 5 véhicules rentables
        </CardTitle>
        <CardDescription>Classement par profit généré</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Véhicule</TableHead>
              <TableHead class="text-right">Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(vehicle, index) in topVehicles" :key="vehicle.id">
              <TableCell>
                <div class="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  >
                    {{ index + 1 }}
                  </Badge>
                  <div>
                    <p class="font-medium">{{ vehicle.immatriculation }}</p>
                    <p class="text-xs text-muted-foreground">{{ vehicle.type }}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell class="text-right">
                <p class="font-medium text-green-600">{{ formatCurrency(vehicle.profit) }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ formatCurrency(vehicle.recettes) }} - {{ formatCurrency(vehicle.depenses) }}
                </p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Top 5 conducteurs les plus performants -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Users class="h-5 w-5" />
          Top 5 conducteurs performants
        </CardTitle>
        <CardDescription>Classement par recettes générées</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conducteur</TableHead>
              <TableHead class="text-right">Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(driver, index) in topDrivers" :key="driver.id">
              <TableCell>
                <div class="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  >
                    {{ index + 1 }}
                  </Badge>
                  <div>
                    <p class="font-medium">{{ driver.nom }}</p>
                    <p class="text-xs text-muted-foreground">{{ driver.vehicule }}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell class="text-right">
                <p class="font-medium text-green-600">{{ formatCurrency(driver.recettes) }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ driver.kmParcourus.toLocaleString() }} km
                </p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Trophy, Users } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Vehicle {
  id: number
  immatriculation: string
  type: string
  recettes: number
  depenses: number
  profit: number
}

interface Driver {
  id: number
  nom: string
  vehicule: string
  recettes: number
  kmParcourus: number
}

export default defineComponent({
  name: 'DashboardTopPerformers',
  components: {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Badge,
    Trophy,
    Users,
  },
  props: {
    topVehicles: {
      type: Array as PropType<Vehicle[]>,
      required: true,
    },
    topDrivers: {
      type: Array as PropType<Driver[]>,
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
