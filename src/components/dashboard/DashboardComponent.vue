<template>
  <div class="space-y-6 p-4 md:p-4 lg:p-5">
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
            <span class="text-sm"
              >{{ nearExpiryDocuments.length }} document(s) expirent bientôt</span
            >
          </div>
          <div v-if="vehiclesInMaintenance.length > 0" class="flex items-center gap-2">
            <div class="h-2 w-2 rounded-full bg-blue-500"></div>
            <span class="text-sm"
              >{{ vehiclesInMaintenance.length }} véhicule(s) en maintenance</span
            >
          </div>
        </div>
      </AlertDescription>
    </Alert>

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
            <div
              class="text-2xl font-bold"
              :class="balance >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ formatCurrency(balance) }}
            </div>
            <p class="text-xs text-muted-foreground">
              {{ balance >= 0 ? 'Bénéfice' : 'Déficit' }} ce mois
            </p>
          </CardContent>
        </div>
      </Card>
    </div>

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

    <!-- Performance financière du mois -->
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

    <!-- Documents bientôt expirés -->
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

    <!-- Tendance d'utilisation des véhicules -->
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
            <div
              v-for="(month, index) in mockData.usageTrends.months"
              :key="month"
              class="text-center"
            >
              <div class="h-16 bg-muted rounded-sm mb-1 flex items-end justify-center p-1">
                <div
                  class="bg-primary rounded-sm w-full transition-all"
                  :style="{
                    height:
                      (mockData.usageTrends.kmData[index] /
                        Math.max(...mockData.usageTrends.kmData)) *
                        100 +
                      '%',
                  }"
                ></div>
              </div>
              <p class="text-xs text-muted-foreground">{{ month }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Répartition des dépenses -->
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

    <!-- Top 5 véhicules et chauffeurs -->
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

      <!-- Top 5 chauffeurs les plus performants -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Users class="h-5 w-5" />
            Top 5 chauffeurs performants
          </CardTitle>
          <CardDescription>Classement par recettes générées</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chauffeur</TableHead>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Car,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Activity,
  BarChart3,
  FileText,
  PieChart,
  Users,
  Trophy,
  Route,
} from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Données mockées pour le dashboard
const mockData = {
  vehicles: {
    total: 15,
    actifs: 12,
    enPanne: 1,
    enRevision: 2,
    vendus: 0,
  },
  finances: {
    monthlyRevenue: 45000,
    monthlyExpenses: 32000,
    revenueGrowth: 12.5,
    targetRevenue: 50000,
  },
  types: {
    voiture: 8,
    utilitaire: 4,
    camion: 3,
  },
  documents: [
    {
      id: 1,
      vehicleInfo: 'AB-123-CD',
      type: 'Assurance',
      dateExpiration: '2025-02-15',
      isExpired: false,
      daysUntilExpiry: 14,
    },
    {
      id: 2,
      vehicleInfo: 'EF-456-GH',
      type: 'Contrôle technique',
      dateExpiration: '2025-01-20',
      isExpired: true,
      daysUntilExpiry: -13,
    },
    {
      id: 3,
      vehicleInfo: 'IJ-789-KL',
      type: 'Vignette',
      dateExpiration: '2025-02-28',
      isExpired: false,
      daysUntilExpiry: 27,
    },
  ],
  usageTrends: {
    currentMonth: 12500,
    previousMonth: 11200,
    months: ['Oct', 'Nov', 'Déc', 'Jan', 'Fév'],
    kmData: [9800, 10200, 11200, 11800, 12500],
  },
  expenseBreakdown: {
    entretien: 12000,
    carburant: 8500,
    assurance: 6000,
    reparations: 3500,
    autres: 2000,
  },
  topVehicles: [
    {
      id: 1,
      immatriculation: 'AB-123-CD',
      type: 'Voiture',
      recettes: 3500,
      depenses: 1200,
      profit: 2300,
    },
    {
      id: 2,
      immatriculation: 'EF-456-GH',
      type: 'Utilitaire',
      recettes: 4200,
      depenses: 1800,
      profit: 2400,
    },
    {
      id: 3,
      immatriculation: 'IJ-789-KL',
      type: 'Camion',
      recettes: 5500,
      depenses: 2200,
      profit: 3300,
    },
    {
      id: 4,
      immatriculation: 'MN-012-OP',
      type: 'Voiture',
      recettes: 2800,
      depenses: 1100,
      profit: 1700,
    },
    {
      id: 5,
      immatriculation: 'QR-345-ST',
      type: 'Utilitaire',
      recettes: 3800,
      depenses: 1600,
      profit: 2200,
    },
  ],
  topDrivers: [
    { id: 1, nom: 'Ahmed Ben Ali', recettes: 8500, kmParcourus: 3200, vehicule: 'AB-123-CD' },
    { id: 2, nom: 'Fatima Zahra', recettes: 7800, kmParcourus: 2950, vehicule: 'EF-456-GH' },
    { id: 3, nom: 'Mohamed Tounsi', recettes: 9200, kmParcourus: 3100, vehicule: 'IJ-789-KL' },
    { id: 4, nom: 'Aisha Mansouri', recettes: 6900, kmParcourus: 2800, vehicule: 'MN-012-OP' },
    { id: 5, nom: 'Youssef Khalil', recettes: 7200, kmParcourus: 2750, vehicule: 'QR-345-ST' },
  ],
}

// Computed properties
const vehicleStats = computed(() => mockData.vehicles)

const monthlyRevenue = computed(() => mockData.finances.monthlyRevenue)
const monthlyExpenses = computed(() => mockData.finances.monthlyExpenses)
const revenueGrowth = computed(() => mockData.finances.revenueGrowth)

const balance = computed(() => monthlyRevenue.value - monthlyExpenses.value)

const vehicleTypeStats = computed(() => mockData.types)

const documentsToExpire = computed(() => mockData.documents)

const expiredDocuments = computed(() => documentsToExpire.value.filter((doc) => doc.isExpired))

const nearExpiryDocuments = computed(() =>
  documentsToExpire.value.filter((doc) => !doc.isExpired && doc.daysUntilExpiry <= 30),
)

const vehiclesInMaintenance = computed(
  () => vehicleStats.value.enPanne + vehicleStats.value.enRevision,
)

const hasAlerts = computed(
  () =>
    expiredDocuments.value.length > 0 ||
    nearExpiryDocuments.value.length > 0 ||
    vehiclesInMaintenance.value > 0,
)

const revenueProgress = computed(() =>
  Math.min((monthlyRevenue.value / mockData.finances.targetRevenue) * 100, 100),
)

const expenseProgress = computed(() =>
  Math.min((monthlyExpenses.value / monthlyRevenue.value) * 100, 100),
)

// Nouvelles computed properties
const usageTrend = computed(() => {
  const current = mockData.usageTrends.currentMonth
  const previous = mockData.usageTrends.previousMonth
  const growth = ((current - previous) / previous) * 100
  return { current, previous, growth: Math.round(growth * 10) / 10 }
})

const expenseBreakdown = computed(() => mockData.expenseBreakdown)

const topVehicles = computed(() => [...mockData.topVehicles].sort((a, b) => b.profit - a.profit))

const topDrivers = computed(() => [...mockData.topDrivers].sort((a, b) => b.recettes - a.recettes))

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}
</script>
