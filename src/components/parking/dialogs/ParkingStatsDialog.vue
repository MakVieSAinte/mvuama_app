<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle>Statistiques du parking</DialogTitle>
        <DialogDescription> Vue d'ensemble de l'utilisation du parc automobile </DialogDescription>
      </DialogHeader>

      <Tabs default-value="general" class="w-full">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="general">
            <BarChart class="mr-2 h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="vehicles">
            <Car class="mr-2 h-4 w-4" />
            Véhicules
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp class="mr-2 h-4 w-4" />
            Tendances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" class="space-y-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent class="p-4">
                <div class="flex flex-col items-center justify-center space-y-1 py-2">
                  <Car class="h-8 w-8 text-primary mb-1" />
                  <p class="text-2xl font-bold">{{ statistics.activeVehicles }}</p>
                  <p class="text-xs text-muted-foreground text-center">Véhicules en sortie</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent class="p-4">
                <div class="flex flex-col items-center justify-center space-y-1 py-2">
                  <Calendar class="h-8 w-8 text-primary mb-1" />
                  <p class="text-2xl font-bold">{{ statistics.totalTrips }}</p>
                  <p class="text-xs text-muted-foreground text-center">Total des sorties</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent class="p-4">
                <div class="flex flex-col items-center justify-center space-y-1 py-2">
                  <Timer class="h-8 w-8 text-primary mb-1" />
                  <p class="text-2xl font-bold">{{ statistics.avgUsageTime }}</p>
                  <p class="text-xs text-muted-foreground text-center">Durée moyenne</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent class="p-4">
                <div class="flex flex-col items-center justify-center space-y-1 py-2">
                  <AlertTriangle class="h-8 w-8 text-destructive mb-1" />
                  <p class="text-2xl font-bold">{{ statistics.overdueVehicles }}</p>
                  <p class="text-xs text-muted-foreground text-center">Retards</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-base">Taux d'occupation du parc</CardTitle>
              <CardDescription> Véhicules en sortie vs disponibles au parking </CardDescription>
            </CardHeader>
            <CardContent class="py-2">
              <div class="flex flex-col space-y-2">
                <div class="grid grid-cols-4 gap-2 items-center">
                  <div class="col-span-1 text-sm">En sortie</div>
                  <div class="col-span-3 flex items-center gap-2">
                    <Progress class="h-2" :value="statistics.occupancyRate" />
                    <span class="text-xs font-medium w-10">{{ statistics.occupancyRate }}%</span>
                  </div>
                </div>
                <div class="grid grid-cols-4 gap-2 items-center">
                  <div class="col-span-1 text-sm">Disponibles</div>
                  <div class="col-span-3 flex items-center gap-2">
                    <Progress class="h-2" :value="100 - statistics.occupancyRate" />
                    <span class="text-xs font-medium w-10"
                      >{{ 100 - statistics.occupancyRate }}%</span
                    >
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-base">Activité récente</CardTitle>
            </CardHeader>
            <CardContent class="p-0">
              <div class="text-sm">
                <div
                  class="grid grid-cols-[25px_1fr_110px] items-start px-4 py-3 hover:bg-muted/50 border-b last:border-0"
                  v-for="entry in recentActivity"
                  :key="entry.id"
                >
                  <span
                    class="flex h-2 w-2 translate-y-1.5 rounded-full"
                    :class="{
                      'bg-green-500': entry.type === 'return',
                      'bg-blue-500': entry.type === 'exit',
                    }"
                  />
                  <div class="flex flex-col">
                    <p class="font-medium leading-none">
                      {{ entry.vehicleInfo }}
                    </p>
                    <p class="text-muted-foreground">
                      {{ entry.message }}
                    </p>
                  </div>
                  <div class="text-muted-foreground text-right">
                    {{ entry.time }}
                  </div>
                </div>
                <div v-if="recentActivity.length === 0" class="py-4 px-4 text-center">
                  <p class="text-muted-foreground">Aucune activité récente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle class="text-base">Véhicules les plus utilisés</CardTitle>
              <CardDescription>
                Classement par nombre de sorties et kilométrage parcouru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-6">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-medium">Par fréquence de sortie</h4>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(vehicle, index) in topVehiclesByUsage"
                      :key="vehicle.id"
                      class="flex items-center"
                    >
                      <span class="font-medium text-muted-foreground w-5">{{ index + 1 }}.</span>
                      <Badge variant="outline" class="mr-2 font-mono">{{
                        vehicle.immatriculation
                      }}</Badge>
                      <span class="flex-1">{{ vehicle.marque }} {{ vehicle.modele }}</span>
                      <span class="ml-auto font-medium">{{ vehicle.count }} sorties</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-medium">Par distance parcourue</h4>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(vehicle, index) in topVehiclesByDistance"
                      :key="vehicle.id"
                      class="flex items-center"
                    >
                      <span class="font-medium text-muted-foreground w-5">{{ index + 1 }}.</span>
                      <Badge variant="outline" class="mr-2 font-mono">{{
                        vehicle.immatriculation
                      }}</Badge>
                      <span class="flex-1">{{ vehicle.marque }} {{ vehicle.modele }}</span>
                      <span class="ml-auto font-medium"
                        >{{ formatNumber(vehicle.distance) }} km</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-base">Répartition par type de véhicule</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="h-[250px] flex flex-col items-center justify-center">
                <!-- Ici on pourrait avoir un graphique avec les proportions de chaque type -->
                <PieChart class="h-32 w-32 text-muted-foreground mb-4" />
                <p class="text-muted-foreground text-sm">
                  Visualisation graphique à intégrer avec une librairie comme Chart.js
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle class="text-base">Évolution des sorties</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="h-[250px] flex flex-col items-center justify-center">
                <BarChart3 class="h-32 w-32 text-muted-foreground mb-4" />
                <p class="text-muted-foreground text-sm">
                  Graphique d'évolution à intégrer avec une librairie comme Chart.js
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-base">Jours et heures d'affluence</CardTitle>
              <CardDescription> Périodes où les sorties sont les plus fréquentes </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-7 gap-2">
                <div v-for="day in weekdays" :key="day.code" class="flex flex-col items-center">
                  <div class="w-full h-24 bg-muted rounded-md relative overflow-hidden">
                    <div
                      class="absolute bottom-0 w-full bg-primary"
                      :style="`height: ${day.activityRate}%`"
                    ></div>
                  </div>
                  <span class="text-xs font-medium mt-1">{{ day.name }}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)"> Fermer </Button>
        <Button>
          <Download class="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { format, parseISO, differenceInHours } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { ParkingEntry, Vehicle } from '../../../types/fleet'

import {
  AlertTriangle,
  BarChart,
  BarChart3,
  Calendar,
  Car,
  Download,
  PieChart,
  Timer,
  TrendingUp,
} from 'lucide-vue-next'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Props
defineProps<{
  open: boolean
  parkingEntries: ParkingEntry[]
  vehicles: Vehicle[]
}>()

// Emits
defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

// Computed Stats
const statistics = computed(() => {
  const activeCount = props.parkingEntries.filter((entry) => !entry.dateSortie).length
  const completedEntries = props.parkingEntries.filter((entry) => entry.dateSortie)
  const totalCount = props.parkingEntries.length

  // Calculer le temps moyen d'utilisation
  let totalHours = 0
  let countWithDuration = 0

  completedEntries.forEach((entry) => {
    if (entry.dateEntree && entry.dateSortie) {
      const hours = differenceInHours(parseISO(entry.dateSortie), parseISO(entry.dateEntree))
      totalHours += hours
      countWithDuration++
    }
  })

  const avgHours = countWithDuration > 0 ? Math.round(totalHours / countWithDuration) : 0

  // Compter les véhicules en retard
  const now = new Date()
  const overdueCount = props.parkingEntries.filter((entry) => {
    if (!entry.dateEcheance || entry.dateSortie) return false
    return parseISO(entry.dateEcheance) < now
  }).length

  // Taux d'occupation (véhicules sortis / total des véhicules)
  const occupancyRate = Math.round((activeCount / props.vehicles.length) * 100)

  return {
    activeVehicles: activeCount,
    totalTrips: totalCount,
    avgUsageTime: `${avgHours}h`,
    overdueVehicles: overdueCount,
    occupancyRate: occupancyRate,
  }
})

// Activité récente
const recentActivity = computed(() => {
  // Fusionner sorties et retours récents pour affichage chronologique
  const activities = []

  // Ajouter les sorties récentes
  const exits = props.parkingEntries
    .filter((entry) => {
      const entryDate = parseISO(entry.dateEntree)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return entryDate >= oneWeekAgo
    })
    .map((entry) => {
      const vehicle = props.vehicles.find((v) => v.id === entry.vehiculeId)
      return {
        id: `exit-${entry.id}`,
        type: 'exit',
        date: parseISO(entry.dateEntree),
        vehicleInfo: vehicle
          ? `${vehicle.immatriculation} - ${vehicle.marque} ${vehicle.modele}`
          : 'Véhicule inconnu',
        message: `Sortie par ${entry.conducteur}`,
        time: format(parseISO(entry.dateEntree), 'PP', { locale: fr }),
      }
    })

  // Ajouter les retours récents
  const returns = props.parkingEntries
    .filter((entry) => {
      if (!entry.dateSortie) return false
      const returnDate = parseISO(entry.dateSortie)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return returnDate >= oneWeekAgo
    })
    .map((entry) => {
      const vehicle = props.vehicles.find((v) => v.id === entry.vehiculeId)
      const kmDiff =
        entry.kilometrageRetour && entry.kilometrageSortie
          ? entry.kilometrageRetour - entry.kilometrageSortie
          : null

      return {
        id: `return-${entry.id}`,
        type: 'return',
        date: parseISO(entry.dateSortie!),
        vehicleInfo: vehicle
          ? `${vehicle.immatriculation} - ${vehicle.marque} ${vehicle.modele}`
          : 'Véhicule inconnu',
        message: kmDiff ? `Retourné après ${kmDiff} km` : 'Retourné au parking',
        time: format(parseISO(entry.dateSortie!), 'PP', { locale: fr }),
      }
    })

  return [...exits, ...returns].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5)
})

// Top véhicules par utilisation
const topVehiclesByUsage = computed(() => {
  const vehicleUsage = props.vehicles.map((vehicle) => {
    const usageCount = props.parkingEntries.filter(
      (entry) => entry.vehiculeId === vehicle.id,
    ).length
    return {
      ...vehicle,
      count: usageCount,
    }
  })

  return vehicleUsage.sort((a, b) => b.count - a.count).slice(0, 5)
})

// Top véhicules par distance
const topVehiclesByDistance = computed(() => {
  const vehicleDistances = props.vehicles.map((vehicle) => {
    let totalDistance = 0

    props.parkingEntries
      .filter((entry) => entry.vehiculeId === vehicle.id && entry.dateSortie)
      .forEach((entry) => {
        if (entry.kilometrageRetour && entry.kilometrageSortie) {
          totalDistance += entry.kilometrageRetour - entry.kilometrageSortie
        }
      })

    return {
      ...vehicle,
      distance: totalDistance,
    }
  })

  return vehicleDistances.sort((a, b) => b.distance - a.distance).slice(0, 5)
})

// Jours de la semaine (simulés)
const weekdays = [
  { code: 'mon', name: 'Lun', activityRate: 65 },
  { code: 'tue', name: 'Mar', activityRate: 80 },
  { code: 'wed', name: 'Mer', activityRate: 45 },
  { code: 'thu', name: 'Jeu', activityRate: 70 },
  { code: 'fri', name: 'Ven', activityRate: 90 },
  { code: 'sat', name: 'Sam', activityRate: 20 },
  { code: 'sun', name: 'Dim', activityRate: 5 },
]

// Formatting
const formatNumber = (num: number): string => {
  return num.toLocaleString('fr-FR')
}
</script>
