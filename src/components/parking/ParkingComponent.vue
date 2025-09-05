<template>
  <div class="space-y-8 min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-8">
    <!-- En-tête avec titre et description -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Gestion du Parking</h1>
        <p class="text-muted-foreground">
          Suivez et gérez les entrées et sorties des véhicules du parc automobile
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <Button variant="outline" class="flex items-center" @click="openStatsDialog">
          <BarChart3 class="mr-2 h-4 w-4" />
          <span>Statistiques</span>
        </Button>
        <Button variant="default" class="flex items-center" @click="showAddForm = true">
          <Plus class="mr-2 h-4 w-4" />
          <span>Nouvelle sortie</span>
        </Button>
      </div>
    </div>

    <!-- Vue principale ou formulaire d'ajout -->
    <div v-if="!showAddForm">
      <!-- Contenu principal dans une Card -->
      <Card class="shadow-md border-border/40">
        <CardHeader class="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <CardTitle>Gestion des véhicules</CardTitle>
            <CardDescription>Suivez l'état et l'utilisation du parc automobile</CardDescription>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <div class="relative w-full md:w-auto">
              <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                v-model="activeSearchQuery"
                placeholder="Rechercher un véhicule..."
                class="pl-8 w-full md:w-[200px]"
              />
            </div>

            <Button
              variant="outline"
              class="w-full md:w-auto"
              @click="loadParkingData"
              :disabled="isLoading"
            >
              <RefreshCw :class="{ 'animate-spin': isLoading }" class="mr-2 h-4 w-4" />
              Actualiser
            </Button>
          </div>
        </CardHeader>

        <CardContent class="px-6">
          <!-- Onglets améliorés -->
          <Tabs default-value="active" class="w-full custom-tabs">
            <TabsList class="w-full md:w-auto flex md:inline-flex overflow-x-auto">
              <TabsTrigger value="active" class="tab-trigger flex items-center gap-2">
                <Car class="h-4 w-4" />
                <span>Véhicules sortis</span>
                <Badge v-if="activeEntries.length > 0" variant="secondary">
                  {{ activeEntries.length }}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="alerts" class="tab-trigger flex items-center gap-2">
                <AlertCircle class="h-4 w-4" />
                <span>Alertes</span>
                <Badge v-if="parkingAlerts.length > 0" variant="destructive">
                  {{ parkingAlerts.length }}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="history" class="tab-trigger flex items-center gap-2">
                <History class="h-4 w-4" />
                <span>Historique</span>
              </TabsTrigger>
              <TabsTrigger value="map" class="tab-trigger flex items-center gap-2">
                <Map class="h-4 w-4" />
                <span>Plan du parking</span>
              </TabsTrigger>
            </TabsList>

            <!-- Contenu des onglets -->
            <TabsContent value="active" class="space-y-6">
              <!-- Véhicules actuellement sortis -->
              <div v-if="activeEntries.length > 0" class="px-2 py-4">
                <div class="mb-4 flex items-center gap-2 px-2">
                  <Search class="h-4 w-4 text-muted-foreground" />
                  <Input
                    v-model="activeSearchQuery"
                    placeholder="Rechercher par immatriculation, conducteur..."
                    class="max-w-sm"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <Card
                    v-for="entry in filteredActiveEntries"
                    :key="entry.id"
                    :class="[
                      'overflow-hidden transition-all hover:shadow-lg',
                      entry.alertStatus?.level === 'expired'
                        ? 'border-t-4 border-t-destructive border-destructive/20 shadow-destructive/10'
                        : entry.alertStatus?.level === 'urgent'
                          ? 'border-t-4 border-t-orange-500 border-orange-500/20 shadow-orange-500/10'
                          : 'border-t-4 border-t-primary/50 border-border/40',
                    ]"
                  >
                    <CardHeader class="pb-2">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <Avatar class="border border-border bg-muted">
                            <Car class="h-5 w-5 text-muted-foreground" />
                            <AvatarFallback>VH</AvatarFallback>
                          </Avatar>
                          <div>
                            <div class="flex items-center">
                              <h3 class="font-semibold text-foreground">
                                {{ getVehicleInfo(entry.vehiculeId)?.immatriculation }}
                              </h3>
                              <Badge variant="outline" class="ml-2 px-1 py-0 h-5 border-none">
                                <span
                                  class="flex items-center gap-1 text-xs"
                                  :class="
                                    entry.alertStatus?.level === 'expired'
                                      ? 'text-destructive'
                                      : entry.alertStatus?.level === 'urgent'
                                        ? 'text-orange-500'
                                        : 'text-muted-foreground'
                                  "
                                >
                                  <span
                                    class="rounded-full w-2 h-2"
                                    :class="
                                      entry.alertStatus?.level === 'expired'
                                        ? 'bg-destructive animate-pulse'
                                        : entry.alertStatus?.level === 'urgent'
                                          ? 'bg-orange-500 animate-pulse'
                                          : 'bg-primary'
                                    "
                                  ></span>
                                  En cours
                                </span>
                              </Badge>
                            </div>
                            <p class="text-sm text-muted-foreground">{{ entry.conducteur }}</p>
                          </div>
                        </div>
                        <div
                          v-if="entry.alertStatus"
                          class="text-sm font-medium flex items-center"
                          :class="entry.alertStatus.color"
                        >
                          <AlertTriangle class="h-4 w-4 mr-1" />
                          <span>{{ entry.alertStatus.message }}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div class="grid grid-cols-2 gap-3 mb-4">
                        <div class="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                          <MapPin class="h-4 w-4 text-muted-foreground" />
                          <div class="flex flex-col">
                            <span class="text-xs text-muted-foreground">Place</span>
                            <span class="text-sm font-medium">{{ entry.place }}</span>
                          </div>
                        </div>
                        <div class="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                          <Clock class="h-4 w-4 text-muted-foreground" />
                          <div class="flex flex-col">
                            <span class="text-xs text-muted-foreground">Durée</span>
                            <span class="text-sm font-medium">{{
                              calculateUsageDuration(entry.dateEntree)
                            }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-3">
                        <div class="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                          <Calendar class="h-4 w-4 text-muted-foreground" />
                          <div class="flex flex-col">
                            <span class="text-xs text-muted-foreground">Sortie le</span>
                            <span class="text-sm font-medium">{{
                              formatDateTime(entry.dateEntree).date
                            }}</span>
                          </div>
                        </div>
                        <div class="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                          <AlertCircle
                            class="h-4 w-4"
                            :class="
                              entry.alertStatus?.level === 'expired'
                                ? 'text-destructive'
                                : entry.alertStatus?.level === 'urgent'
                                  ? 'text-orange-500'
                                  : 'text-muted-foreground'
                            "
                          />
                          <div class="flex flex-col">
                            <span class="text-xs text-muted-foreground">Échéance</span>
                            <span
                              class="text-sm font-medium"
                              :class="entry.alertStatus ? entry.alertStatus.color : ''"
                            >
                              {{ formatDateTime(entry.dateEcheance).date }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div v-if="entry.destination" class="mt-3">
                        <div class="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                          <Navigation class="h-4 w-4 text-muted-foreground" />
                          <div class="flex flex-col">
                            <span class="text-xs text-muted-foreground">Destination</span>
                            <span class="text-sm font-medium">{{ entry.destination }}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter class="flex justify-end gap-2 pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        @click="openDetailDialog(entry)"
                        class="h-8"
                      >
                        <Eye class="mr-1.5 h-3.5 w-3.5" />
                        Détails
                      </Button>
                      <Button size="sm" @click="openReturnDialog(entry)" class="h-8">
                        <CornerDownLeft class="mr-1.5 h-3.5 w-3.5" />
                        Retour
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              <!-- Message si aucun véhicule sorti -->
              <div v-else class="py-8">
                <EmptyState
                  title="Aucun véhicule en cours d'utilisation"
                  description="Tous les véhicules sont actuellement dans le parking"
                  :icon="Car"
                >
                  <Button @click="showAddForm = true" variant="default">
                    <Plus class="mr-2 h-4 w-4" />
                    Nouvelle sortie
                  </Button>
                </EmptyState>
              </div>
            </TabsContent>

            <!-- Onglet Alertes -->
            <TabsContent value="alerts" class="space-y-6">
              <div v-if="parkingAlerts.length > 0" class="px-2 py-4">
                <Alert variant="destructive" class="mb-6">
                  <AlertCircle class="h-4 w-4" />
                  <AlertTitle>Attention</AlertTitle>
                  <AlertDescription>
                    {{ parkingAlerts.length }} véhicule(s) ont dépassé ou vont bientôt dépasser leur
                    durée autorisée.
                  </AlertDescription>
                </Alert>

                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <Card
                    v-for="alert in parkingAlerts"
                    :key="alert.id"
                    :class="[
                      'overflow-hidden transition-all hover:shadow-lg',
                      alert.alert?.level === 'expired'
                        ? 'border-t-4 border-t-destructive border-destructive/20'
                        : 'border-t-4 border-t-orange-500 border-orange-500/20',
                    ]"
                  >
                    <CardHeader class="pb-2">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <Avatar class="bg-destructive/10 border-none">
                            <AlertTriangle
                              :class="[
                                'h-5 w-5',
                                alert.alert?.level === 'expired'
                                  ? 'text-destructive'
                                  : 'text-orange-500',
                              ]"
                            />
                            <AvatarFallback>!</AvatarFallback>
                          </Avatar>
                          <div>
                            <div class="flex items-center gap-1">
                              <h3 class="font-semibold text-foreground">
                                {{ getVehicleInfo(alert.vehiculeId)?.immatriculation }}
                              </h3>
                              <Badge
                                :variant="
                                  alert.alert?.level === 'expired' ? 'destructive' : 'outline'
                                "
                                class="ml-1 px-1.5 py-0 h-5"
                              >
                                <span class="text-xs">{{
                                  alert.alert?.level === 'expired' ? 'Dépassé' : 'Urgent'
                                }}</span>
                              </Badge>
                            </div>
                            <p class="text-sm text-muted-foreground">{{ alert.conducteur }}</p>
                          </div>
                        </div>
                        <div
                          class="text-sm font-medium"
                          :class="
                            alert.alert?.level === 'expired'
                              ? 'text-destructive'
                              : 'text-orange-500'
                          "
                        >
                          {{ alert.alert?.message }}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div class="grid grid-cols-2 gap-3 mb-3">
                        <div class="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                          <MapPin class="h-4 w-4 text-muted-foreground" />
                          <div class="flex flex-col">
                            <span class="text-xs text-muted-foreground">Place</span>
                            <span class="text-sm font-medium">{{ alert.place }}</span>
                          </div>
                        </div>
                        <div class="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                          <Clock class="h-4 w-4 text-muted-foreground" />
                          <div class="flex flex-col">
                            <span class="text-xs text-muted-foreground">Durée</span>
                            <span class="text-sm font-medium">{{
                              calculateUsageDuration(alert.dateEntree)
                            }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-3">
                        <div class="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                          <Calendar class="h-4 w-4 text-muted-foreground" />
                          <div class="flex flex-col">
                            <span class="text-xs text-muted-foreground">Sortie le</span>
                            <span class="text-sm font-medium">{{
                              formatDateTime(alert.dateEntree).date
                            }}</span>
                          </div>
                        </div>
                        <div class="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                          <AlertCircle
                            class="h-4 w-4"
                            :class="
                              alert.alert?.level === 'expired'
                                ? 'text-destructive'
                                : 'text-orange-500'
                            "
                          />
                          <div class="flex flex-col">
                            <span class="text-xs text-muted-foreground">Échéance</span>
                            <span
                              class="text-sm font-medium"
                              :class="
                                alert.alert?.level === 'expired'
                                  ? 'text-destructive'
                                  : 'text-orange-500'
                              "
                            >
                              {{ formatDateTime(alert.dateEcheance).date }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter class="flex justify-end gap-2 pt-0">
                      <Button size="sm" @click="openReturnDialog(alert)" class="h-8">
                        <CornerDownLeft class="mr-1.5 h-3.5 w-3.5" />
                        Marquer le retour
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              <div v-else class="py-8">
                <EmptyState
                  title="Aucune alerte en cours"
                  description="Tous les véhicules sont dans les délais autorisés"
                  :icon="CheckCircle"
                  variant="success"
                />
              </div>
            </TabsContent>

            <!-- Onglet Historique -->
            <TabsContent value="history" class="space-y-6">
              <div
                class="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
              >
                <div class="flex items-center gap-2 w-full sm:max-w-sm">
                  <Search class="h-4 w-4 text-muted-foreground" />
                  <Input
                    v-model="historySearchQuery"
                    placeholder="Rechercher dans l'historique..."
                    class="w-full sm:max-w-sm"
                  />
                </div>
                <div class="flex items-center gap-2 w-full sm:w-auto">
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button variant="outline" class="w-full sm:w-auto justify-start">
                        <CalendarRange class="mr-2 h-4 w-4" />
                        <span>Filtrer par date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <CalendarComp
                        mode="range"
                        :selected-range="dateRange"
                        @update:selected-range="updateDateRange"
                        class="border-none"
                      />
                      <div class="flex items-center justify-between p-3 border-t">
                        <Button variant="ghost" size="sm" @click="clearDateRange">
                          Réinitialiser
                        </Button>
                        <Button size="sm" @click="applyDateRange"> Appliquer </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="outline" class="w-full sm:w-auto">
                        <ListFilter class="mr-2 h-4 w-4" />
                        <span class="hidden sm:inline">Filtrer</span>
                        <ChevronDown class="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem v-model="filters.showShortTrips">
                        Trajets courts (&lt; 10km)
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem v-model="filters.showLongTrips">
                        Trajets longs (&gt; 100km)
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem v-model="filters.showLatestMonth">
                        Dernier mois seulement
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <!-- Tableau d'historique -->
              <div
                v-if="filteredHistoryEntries.length > 0"
                class="rounded-md border overflow-hidden"
              >
                <div class="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow class="bg-muted/50 hover:bg-muted/50">
                        <TableHead class="font-semibold">Véhicule</TableHead>
                        <TableHead class="font-semibold">Conducteur</TableHead>
                        <TableHead class="font-semibold">Date sortie</TableHead>
                        <TableHead class="font-semibold">Date retour</TableHead>
                        <TableHead class="font-semibold">Durée</TableHead>
                        <TableHead class="font-semibold">Distance</TableHead>
                        <TableHead class="font-semibold"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow
                        v-for="entry in paginatedHistoryEntries"
                        :key="entry.id"
                        class="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell class="font-medium">
                          <div class="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              class="rounded-sm font-mono text-xs border-primary/20"
                            >
                              {{ getVehicleInfo(entry.vehiculeId)?.immatriculation || '???' }}
                            </Badge>
                            <span class="text-xs text-muted-foreground">
                              {{ getVehicleInfo(entry.vehiculeId)?.marque }}
                              {{ getVehicleInfo(entry.vehiculeId)?.modele }}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span class="font-medium">{{ entry.conducteur }}</span>
                        </TableCell>
                        <TableCell>
                          <div class="flex flex-col">
                            <span class="font-medium">{{
                              formatDateTime(entry.dateEntree).date
                            }}</span>
                            <span class="text-xs text-muted-foreground">{{
                              formatDateTime(entry.dateEntree).time
                            }}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div class="flex flex-col">
                            <span class="font-medium">{{
                              formatDateTime(entry.dateSortie).date
                            }}</span>
                            <span class="text-xs text-muted-foreground">{{
                              formatDateTime(entry.dateSortie).time
                            }}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span class="font-medium">
                            {{ calculateUsageDuration(entry.dateEntree, entry.dateSortie) }}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" class="whitespace-nowrap">
                            {{ getKmDifference(entry) > 0 ? `${getKmDifference(entry)} km` : '-' }}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            @click="openDetailDialog(entry)"
                            class="h-8 w-8"
                          >
                            <Eye class="h-4 w-4" />
                            <span class="sr-only">Détails</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div class="flex items-center justify-between border-t px-6 py-4 bg-muted/20">
                  <div class="text-sm text-muted-foreground">
                    <span class="font-medium text-foreground">{{
                      filteredHistoryEntries.length
                    }}</span>
                    résultat(s) sur
                    <span class="font-medium text-foreground">{{ completedEntries.length }}</span>
                    entrées
                  </div>
                  <div class="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      :disabled="currentPage === 1"
                      @click="currentPage--"
                      class="h-8 w-8 p-0"
                    >
                      <ChevronLeft class="h-4 w-4" />
                    </Button>
                    <div class="flex min-w-[100px] items-center justify-center text-sm font-medium">
                      Page <span class="mx-1 font-bold">{{ currentPage }}</span> sur
                      <span class="mx-1 font-bold">{{ totalPages }}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      :disabled="currentPage === totalPages"
                      @click="currentPage++"
                      class="h-8 w-8 p-0"
                    >
                      <ChevronRight class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div v-else class="py-8">
                <EmptyState
                  title="Aucun enregistrement"
                  description="L'historique est vide ou aucun résultat ne correspond à vos critères"
                  :icon="History"
                />
              </div>
            </TabsContent>

            <!-- Onglet Plan du parking -->
            <TabsContent value="map" class="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle class="flex items-center gap-2">
                        <Map class="h-5 w-5 text-primary" />
                        Plan interactif du parking
                      </CardTitle>
                      <CardDescription>
                        Visualisez l'état actuel des places de parking et gérez l'attribution
                      </CardDescription>
                    </div>
                    <div class="flex gap-2">
                      <Badge variant="outline" class="flex items-center gap-1">
                        <span class="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                        <span>Libre</span>
                      </Badge>
                      <Badge variant="outline" class="flex items-center gap-1">
                        <span class="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                        <span>Occupé</span>
                      </Badge>
                      <Badge variant="outline" class="flex items-center gap-1">
                        <span class="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
                        <span>Réservé</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent class="pt-4">
                  <ParkingMapComponent
                    :active-entries="activeEntries"
                    :completed-entries="completedEntries"
                    @place-clicked="handleParkingPlaceClicked"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  </div>

  <div v-if="showAddForm">
    <!-- Formulaire d'ajout d'une sortie -->
    <AddParkingEntryForm
      :vehicles="availableVehicles"
      @submit="handleEntrySubmit"
      @cancel="showAddForm = false"
    />

    <!-- Dialogs -->
    <ParkingEntryDetailsDialog
      v-model:open="showDetailDialog"
      :entry="selectedEntry"
      :vehicle="selectedEntry ? getVehicleInfo(selectedEntry.vehiculeId) || null : null"
    />

    <ReturnVehicleDialog
      v-model:open="showReturnDialog"
      :entry="selectedEntry"
      :vehicle="selectedEntry ? getVehicleInfo(selectedEntry.vehiculeId) || null : null"
      @confirm="handleReturn"
    />

    <ParkingStatsDialog
      v-model:open="showStatsDialog"
      :parking-entries="parkingEntries"
      :vehicles="mockVehicles"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { format, parseISO, addMonths, isBefore, isAfter, differenceInDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { mockParkingEntries, mockVehicles } from '../../data/mockData'
import type { ParkingEntry, Vehicle } from '../../types/fleet'
import { RefreshCw } from 'lucide-vue-next'
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  CalendarRange,
  Car,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CornerDownLeft,
  Eye,
  History,
  ListFilter,
  Map,
  MapPin,
  Navigation,
  Plus,
  Search,
} from 'lucide-vue-next'

// Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComp } from '@/components/ui/calendar'

// Custom components
// Enregistrement direct des composants
import '@/components/parking/AddParkingEntryForm.vue'
import '@/components/parking/dialogs/ParkingEntryDetailsDialog.vue'
import '@/components/parking/dialogs/ReturnVehicleDialog.vue'
import '@/components/parking/dialogs/ParkingStatsDialog.vue'
import '@/components/parking/ParkingMapComponent.vue'
import '@/components/utils/EmptyState.vue'

// Types
interface ParkingAlertStatus {
  level: 'expired' | 'urgent' | 'warning'
  message: string
  color: string
}

interface ActiveEntry extends ParkingEntry {
  alertStatus: ParkingAlertStatus | null
}

interface ParkingAlertEntry extends ParkingEntry {
  alert: ParkingAlertStatus | null
}

interface DateTimeFormat {
  date: string
  time: string
}

// State
const showAddForm = ref<boolean>(false)
const parkingEntries = ref<ParkingEntry[]>([...mockParkingEntries])
const showDetailDialog = ref<boolean>(false)
const showReturnDialog = ref<boolean>(false)
const showStatsDialog = ref<boolean>(false)
const selectedEntry = ref<ParkingEntry | null>(null)
const isLoading = ref<boolean>(false)

// Search and Filters
const activeSearchQuery = ref('')
const historySearchQuery = ref('')
const dateRange = ref<[Date | null, Date | null]>([null, null])

// Méthode pour rafraîchir les données
const loadParkingData = async () => {
  isLoading.value = true
  try {
    // Simuler une charge
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Dans une vraie application, vous feriez appel à votre API ici
    parkingEntries.value = [...mockParkingEntries]
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    isLoading.value = false
  }
}
const appliedDateRange = ref<[Date | null, Date | null]>([null, null])
const filters = ref({
  showShortTrips: false,
  showLongTrips: false,
  showLatestMonth: false,
})

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)

// Form data supprimée car non utilisée

// Computed properties
const availableVehicles = computed((): Vehicle[] => {
  return mockVehicles.filter((v) => v.statut === 'Disponible')
})

const activeEntries = computed((): ActiveEntry[] => {
  return parkingEntries.value
    .filter((entry) => !entry.dateSortie)
    .map((entry) => ({
      ...entry,
      alertStatus: getParkingAlertStatus(entry),
    }))
})

const filteredActiveEntries = computed((): ActiveEntry[] => {
  if (!activeSearchQuery.value) return activeEntries.value

  const query = activeSearchQuery.value.toLowerCase()
  return activeEntries.value.filter((entry) => {
    const vehicle = getVehicleInfo(entry.vehiculeId)
    return (
      vehicle?.immatriculation.toLowerCase().includes(query) ||
      vehicle?.marque.toLowerCase().includes(query) ||
      vehicle?.modele.toLowerCase().includes(query) ||
      entry.conducteur.toLowerCase().includes(query) ||
      entry.place.toLowerCase().includes(query) ||
      (entry.destination && entry.destination.toLowerCase().includes(query))
    )
  })
})

const completedEntries = computed((): ParkingEntry[] => {
  return parkingEntries.value.filter((entry) => entry.dateSortie)
})

const filteredHistoryEntries = computed((): ParkingEntry[] => {
  let filtered = completedEntries.value

  // Search query
  if (historySearchQuery.value) {
    const query = historySearchQuery.value.toLowerCase()
    filtered = filtered.filter((entry) => {
      const vehicle = getVehicleInfo(entry.vehiculeId)
      return (
        vehicle?.immatriculation.toLowerCase().includes(query) ||
        vehicle?.marque.toLowerCase().includes(query) ||
        vehicle?.modele.toLowerCase().includes(query) ||
        entry.conducteur.toLowerCase().includes(query) ||
        entry.place.toLowerCase().includes(query) ||
        (entry.destination && entry.destination.toLowerCase().includes(query))
      )
    })
  }

  // Date range filter
  if (appliedDateRange.value[0] && appliedDateRange.value[1]) {
    filtered = filtered.filter((entry) => {
      const entryDate = parseISO(entry.dateEntree)
      return (
        isAfter(entryDate, appliedDateRange.value[0]!) &&
        isBefore(entryDate, appliedDateRange.value[1]!)
      )
    })
  }

  // Short trips filter
  if (filters.value.showShortTrips) {
    filtered = filtered.filter((entry) => {
      const distance = getKmDifference(entry)
      return distance > 0 && distance < 10
    })
  }

  // Long trips filter
  if (filters.value.showLongTrips) {
    filtered = filtered.filter((entry) => {
      const distance = getKmDifference(entry)
      return distance >= 100
    })
  }

  // Latest month filter
  if (filters.value.showLatestMonth) {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    filtered = filtered.filter((entry) => {
      const entryDate = parseISO(entry.dateEntree)
      return isAfter(entryDate, oneMonthAgo)
    })
  }

  return filtered
})

// Pagination for history
const paginatedHistoryEntries = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return filteredHistoryEntries.value.slice(startIndex, startIndex + itemsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(filteredHistoryEntries.value.length / itemsPerPage)
})

const parkingAlerts = computed((): ParkingAlertEntry[] => {
  return activeEntries.value
    .map((entry) => ({
      ...entry,
      alert: entry.alertStatus,
    }))
    .filter(
      (entry) => entry.alert && (entry.alert.level === 'urgent' || entry.alert.level === 'expired'),
    )
})

// Watch for changes that should reset pagination
watch([historySearchQuery, filters, appliedDateRange], () => {
  currentPage.value = 1
})

// Methods
const formatDateTime = (dateString?: string): DateTimeFormat => {
  if (!dateString) {
    return { date: '-', time: '-' }
  }

  const date = parseISO(dateString)
  return {
    date: format(date, 'PPP', { locale: fr }),
    time: format(date, 'HH:mm', { locale: fr }),
  }
}

const calculateUsageDuration = (dateEntree: string, dateSortie?: string): string => {
  const start = parseISO(dateEntree)
  const end = dateSortie ? parseISO(dateSortie) : new Date()

  const diffMs = end.getTime() - start.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffDays > 0) {
    return `${diffDays}j ${diffHours}h ${diffMinutes}min`
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}min`
  } else {
    return `${diffMinutes}min`
  }
}

const getKmDifference = (entry: ParkingEntry): number => {
  return entry.kilometrageRetour && entry.kilometrageSortie
    ? entry.kilometrageRetour - entry.kilometrageSortie
    : 0
}

const getVehicleInfo = (vehiculeId: string): Vehicle | undefined => {
  return mockVehicles.find((v) => v.id === vehiculeId)
}

const getParkingAlertStatus = (entry: ParkingEntry): ParkingAlertStatus | null => {
  if (!entry.dateEcheance) return null

  const today = new Date()
  const expiryDate = parseISO(entry.dateEcheance)
  const daysUntilExpiry = differenceInDays(expiryDate, today)

  if (daysUntilExpiry < 0) {
    return {
      level: 'expired',
      message: `Dépassement de la durée autorisée (${Math.abs(daysUntilExpiry)} jours de retard)`,
      color: 'text-destructive',
    }
  } else if (daysUntilExpiry <= 10) {
    return {
      level: 'urgent',
      message: `Échéance imminente dans ${daysUntilExpiry} jour(s)`,
      color: 'text-orange-500',
    }
  } else if (daysUntilExpiry <= 30) {
    return {
      level: 'warning',
      message: `Échéance dans ${daysUntilExpiry} jours`,
      color: 'text-amber-500',
    }
  }

  return null
}

const handleEntrySubmit = (formData: {
  vehiculeId: string
  place: string
  conducteur: string
  destination?: string
  kilometrageSortie: number
}): void => {
  const entryDate = new Date()
  const expiryDate = addMonths(entryDate, 3)

  const entry: ParkingEntry = {
    id: Date.now().toString(),
    dateEntree: entryDate.toISOString(),
    dateEcheance: expiryDate.toISOString(),
    ...formData,
  }

  parkingEntries.value.unshift(entry)
  showAddForm.value = false
}

const handleReturn = (returnData: {
  entryId: string
  kilometrageRetour: number
  notes?: string
}): void => {
  const index = parkingEntries.value.findIndex((entry) => entry.id === returnData.entryId)

  if (index !== -1) {
    parkingEntries.value[index] = {
      ...parkingEntries.value[index],
      dateSortie: new Date().toISOString(),
      kilometrageRetour: returnData.kilometrageRetour,
    }
    showReturnDialog.value = false
  }
}

const openDetailDialog = (entry: ParkingEntry): void => {
  selectedEntry.value = entry
  showDetailDialog.value = true
}

const openReturnDialog = (entry: ParkingEntry): void => {
  selectedEntry.value = entry
  showReturnDialog.value = true
}

const openStatsDialog = (): void => {
  showStatsDialog.value = true
}

const updateDateRange = (range: [Date | null, Date | null]): void => {
  dateRange.value = range
}

const applyDateRange = (): void => {
  appliedDateRange.value = [...dateRange.value]
}

const clearDateRange = (): void => {
  dateRange.value = [null, null]
  appliedDateRange.value = [null, null]
}

const handleParkingPlaceClicked = (placeId: string): void => {
  // Cette fonction sera implémentée dans le composant de plan de parking
  console.log(`Place de parking cliquée: ${placeId}`)
}
</script>
