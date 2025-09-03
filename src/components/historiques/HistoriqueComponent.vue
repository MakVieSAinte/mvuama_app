<template>
  <div class="space-y-8 min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-8">
    <!-- En-tête avec titre et description -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Historique Général</h1>
        <p class="text-muted-foreground">
          Consultez l'historique de toutes les activités sur votre compte
        </p>
      </div>
    </div>

    <!-- Contenu principal -->
    <Card>
      <CardHeader class="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <CardTitle>Journal d'activité</CardTitle>
          <CardDescription>
            Visualisez l'historique de toutes les actions effectuées
          </CardDescription>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <div class="relative w-full md:w-auto">
            <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Rechercher..."
              class="pl-8 w-full md:w-[200px]"
            />
          </div>

          <Button variant="outline" size="icon" title="Exporter" @click="exportHistory">
            <Download class="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            class="w-full md:w-auto"
            @click="loadHistoryData"
            :disabled="isLoading"
          >
            <RefreshCw :class="{ 'animate-spin': isLoading }" class="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </CardHeader>

      <!-- Onglets de filtrage par type d'activité -->
      <div class="px-6">
        <Tabs v-model="activeTab" class="w-full custom-tabs">
          <TabsList class="w-full md:w-auto flex md:inline-flex overflow-x-auto">
            <TabsTrigger value="all" class="tab-trigger">
              Toutes les activités
              <Badge v-if="filterCounts.all > 0" variant="secondary" class="ml-2">
                {{ filterCounts.all }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="create" class="tab-trigger">
              Créations
              <Badge v-if="filterCounts.create > 0" variant="secondary" class="ml-2">
                {{ filterCounts.create }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="update" class="tab-trigger">
              Modifications
              <Badge v-if="filterCounts.update > 0" variant="secondary" class="ml-2">
                {{ filterCounts.update }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="delete" class="tab-trigger">
              Suppressions
              <Badge v-if="filterCounts.delete > 0" variant="secondary" class="ml-2">
                {{ filterCounts.delete }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="login" class="tab-trigger">
              Connexions
              <Badge v-if="filterCounts.login > 0" variant="secondary" class="ml-2">
                {{ filterCounts.login }}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CardContent>
        <!-- Filtres avancés -->
        <div class="mb-4">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <div
                class="flex items-center cursor-pointer text-sm text-muted-foreground hover:text-foreground"
              >
                <SlidersHorizontal class="mr-2 h-4 w-4" />
                <span>Filtres avancés</span>
                <ChevronDown
                  class="ml-2 h-4 w-4 transition-transform"
                  :class="{ 'rotate-180': isFilterExpanded }"
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <!-- Date de début -->
                <div>
                  <Label for="startDate">Date de début</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal"
                        :class="{ 'text-muted-foreground': !startDate }"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{ startDate ? formatDateFull(startDate) : 'Sélectionner une date' }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar v-model="startDate" />
                    </PopoverContent>
                  </Popover>
                </div>

                <!-- Date de fin -->
                <div>
                  <Label for="endDate">Date de fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal"
                        :class="{ 'text-muted-foreground': !endDate }"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{ endDate ? formatDateFull(endDate) : 'Sélectionner une date' }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar v-model="endDate" />
                    </PopoverContent>
                  </Popover>
                </div>

                <!-- Utilisateur -->
                <div>
                  <Label for="userFilter">Utilisateur</Label>
                  <Select v-model="userFilter">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Tous les utilisateurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les utilisateurs</SelectItem>
                      <SelectItem v-for="user in users" :key="user.id" :value="user.id">
                        {{ user.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Boutons d'action -->
                <div class="md:col-span-3 flex justify-end gap-2 mt-2">
                  <Button variant="outline" @click="resetFilters">
                    <XIcon class="mr-2 h-4 w-4" />
                    Réinitialiser
                  </Button>
                  <Button @click="applyFilters">
                    <CheckIcon class="mr-2 h-4 w-4" />
                    Appliquer
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <!-- Tableau de l'historique -->
        <div class="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date et heure</TableHead>
                <TableHead>Action</TableHead>
                <TableHead class="hidden md:table-cell">Élément</TableHead>
                <TableHead class="hidden md:table-cell">Utilisateur</TableHead>
                <TableHead class="hidden lg:table-cell">IP</TableHead>
                <TableHead class="text-right">Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <!-- Message de chargement -->
              <TableRow v-if="isLoading">
                <TableCell colspan="6" class="h-24 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <RefreshCw class="h-6 w-6 animate-spin text-primary" />
                    <span class="mt-2">Chargement de l'historique...</span>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Message vide -->
              <TableRow v-else-if="filteredHistory.length === 0">
                <TableCell colspan="6" class="h-24 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <History class="h-10 w-10 text-muted-foreground/50 mb-2" />
                    <span class="text-muted-foreground">Aucune activité trouvée</span>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Liste des activités -->
              <TableRow v-for="item in filteredHistory" :key="item.id">
                <TableCell>
                  <div class="flex flex-col">
                    <div class="font-medium">{{ formatDate(item.timestamp) }}</div>
                    <div class="text-xs text-muted-foreground">
                      {{ formatTime(item.timestamp) }}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Badge :variant="getActionVariant(item.action)">
                      {{ getActionName(item.action) }}
                    </Badge>
                    <div class="md:hidden text-xs text-muted-foreground">
                      {{ item.targetType }}
                      {{ item.targetId ? `#${item.targetId.substring(0, 6)}` : '' }}
                    </div>
                  </div>
                </TableCell>
                <TableCell class="hidden md:table-cell">
                  <div class="flex items-center gap-1">
                    <component
                      :is="getEntityIcon(item.targetType)"
                      class="h-4 w-4 text-muted-foreground"
                    />
                    <span>{{ getEntityName(item.targetType) }}</span>
                    <span v-if="item.targetName" class="text-xs text-muted-foreground"
                      >({{ item.targetName }})</span
                    >
                  </div>
                </TableCell>
                <TableCell class="hidden md:table-cell">
                  <div class="flex items-center gap-2">
                    <UserIcon class="h-4 w-4 text-muted-foreground" />
                    {{ item.userName }}
                  </div>
                </TableCell>
                <TableCell class="hidden lg:table-cell">
                  <div class="flex items-center gap-1">
                    <Globe class="h-3 w-3 text-muted-foreground" />
                    <span class="text-xs font-mono">{{ item.ip }}</span>
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Voir les détails"
                    @click="showDetails(item)"
                  >
                    <Eye class="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4">
          <div class="text-sm text-muted-foreground">
            Affichage de {{ filteredHistory.length }} sur {{ totalItems }} activités
          </div>
          <div class="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <ChevronLeft class="h-4 w-4" />
            </Button>
            <div class="flex items-center gap-1 mx-2">
              <span
                v-for="page in displayedPages"
                :key="page"
                class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm"
                :class="
                  page === currentPage
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground cursor-pointer'
                "
                @click="currentPage = page"
              >
                {{ page }}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Dialogue de détails de l'activité -->
  <Dialog v-model:open="detailsDialog">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Détails de l'activité</DialogTitle>
        <DialogDescription> Informations complètes sur cette action </DialogDescription>
      </DialogHeader>

      <div v-if="selectedItem" class="space-y-4 my-2">
        <div class="grid grid-cols-3 gap-2">
          <div class="text-sm text-muted-foreground">Date:</div>
          <div class="col-span-2 font-medium">{{ formatDateFull(selectedItem.timestamp) }}</div>

          <div class="text-sm text-muted-foreground">Heure:</div>
          <div class="col-span-2 font-medium">{{ formatTime(selectedItem.timestamp) }}</div>

          <div class="text-sm text-muted-foreground">Action:</div>
          <div class="col-span-2">
            <Badge :variant="getActionVariant(selectedItem.action)">
              {{ getActionName(selectedItem.action) }}
            </Badge>
          </div>

          <div class="text-sm text-muted-foreground">Type d'élément:</div>
          <div class="col-span-2 font-medium">{{ getEntityName(selectedItem.targetType) }}</div>

          <div class="text-sm text-muted-foreground">Identifiant:</div>
          <div class="col-span-2 font-mono text-sm">{{ selectedItem.targetId }}</div>

          <div class="text-sm text-muted-foreground">Nom de l'élément:</div>
          <div class="col-span-2">{{ selectedItem.targetName || 'Non disponible' }}</div>

          <div class="text-sm text-muted-foreground">Utilisateur:</div>
          <div class="col-span-2 font-medium">{{ selectedItem.userName }}</div>

          <div class="text-sm text-muted-foreground">Email:</div>
          <div class="col-span-2">{{ selectedItem.userEmail }}</div>

          <div class="text-sm text-muted-foreground">Adresse IP:</div>
          <div class="col-span-2 font-mono text-sm">{{ selectedItem.ip }}</div>

          <div class="text-sm text-muted-foreground">Navigateur:</div>
          <div class="col-span-2 text-sm">{{ selectedItem.userAgent }}</div>
        </div>

        <!-- Données de modification -->
        <div v-if="selectedItem.changes" class="mt-4">
          <h4 class="text-sm font-medium mb-2">Modifications apportées:</h4>
          <div class="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Champ</TableHead>
                  <TableHead>Avant</TableHead>
                  <TableHead>Après</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(change, field) in selectedItem.changes" :key="field">
                  <TableCell class="font-medium">{{ formatFieldName(field) }}</TableCell>
                  <TableCell>
                    <span v-if="isObject(change.before)">
                      <Button variant="ghost" size="sm" @click="viewJSON(change.before)">
                        Voir JSON
                      </Button>
                    </span>
                    <span v-else>{{ formatValue(change.before) }}</span>
                  </TableCell>
                  <TableCell>
                    <span v-if="isObject(change.after)">
                      <Button variant="ghost" size="sm" @click="viewJSON(change.after)">
                        Voir JSON
                      </Button>
                    </span>
                    <span v-else>{{ formatValue(change.after) }}</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="detailsDialog = false">Fermer</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Dialogue pour afficher du JSON -->
  <Dialog v-model:open="jsonDialog">
    <DialogContent class="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>Données JSON</DialogTitle>
      </DialogHeader>

      <div class="bg-muted rounded-md p-2 overflow-auto max-h-[400px]">
        <pre class="text-sm font-mono whitespace-pre-wrap">{{ jsonContent }}</pre>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="jsonDialog = false">Fermer</Button>
        <Button @click="copyJsonToClipboard">
          <Copy class="mr-2 h-4 w-4" />
          Copier
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useSonner } from '@/plugins/sonner'
import {
  Search,
  History,
  RefreshCw,
  Eye,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CalendarIcon,
  Car,
  User as UserIcon,
  FileText,
  Globe,
  Copy,
  Check as CheckIcon,
  X as XIcon,
} from 'lucide-vue-next'
import '@/assets/css/custom-tabs.css'

// Types
type ActionType = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'restore'
type EntityType =
  | 'vehicle'
  | 'driver'
  | 'receipt'
  | 'payment'
  | 'document'
  | 'user'
  | 'agency'
  | 'system'

interface HistoryItem {
  id: string
  timestamp: Date
  action: ActionType
  targetType: EntityType
  targetId?: string
  targetName?: string
  userId: string
  userName: string
  userEmail: string
  ip: string
  userAgent: string
  changes?: Record<string, { before: any; after: any }>
}

interface UserInfo {
  id: string
  name: string
  email: string
}

export default defineComponent({
  name: 'HistoriqueComponent',
  components: {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Button,
    Input,
    Label,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Badge,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Calendar,
    Search,
    History,
    RefreshCw,
    Eye,
    Download,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    CalendarIcon,
    Car,
    UserIcon,
    FileText,
    Globe,
    Copy,
    CheckIcon,
    XIcon,
  },
  setup() {
    const { toastSuccess, toastError } = useSonner()
    const historyData = ref<HistoryItem[]>([])
    const isLoading = ref(false)
    const activeTab = ref<ActionType | 'all'>('all')
    const searchQuery = ref('')
    const isFilterExpanded = ref(false)
    const startDate = ref<Date | null>(null)
    const endDate = ref<Date | null>(null)
    const userFilter = ref('')
    const detailsDialog = ref(false)
    const selectedItem = ref<HistoryItem | null>(null)
    const jsonDialog = ref(false)
    const jsonContent = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // Liste des utilisateurs pour le filtre
    const users = ref<UserInfo[]>([
      { id: 'user1', name: 'Admin Système', email: 'admin@mvuama.com' },
      { id: 'user2', name: 'Jean Dupont', email: 'jean.dupont@mvuama.com' },
      { id: 'user3', name: 'Marie Martin', email: 'marie.martin@mvuama.com' },
      { id: 'user4', name: 'Pierre Dubois', email: 'pierre.dubois@mvuama.com' },
      { id: 'user5', name: 'Sophie Bernard', email: 'sophie.bernard@mvuama.com' },
    ])

    // Charger les données d'historique
    const loadHistoryData = async () => {
      isLoading.value = true
      try {
        // Simuler un appel API
        await new Promise((resolve) => setTimeout(resolve, 1200))

        historyData.value = generateMockHistoryData()
      } catch (error) {
        console.error("Erreur lors du chargement des données d'historique", error)
        toastError("Impossible de charger l'historique")
      } finally {
        isLoading.value = false
      }
    }

    // Générer des données de test pour l'historique
    const generateMockHistoryData = (): HistoryItem[] => {
      const mockData: HistoryItem[] = []
      const actionTypes: ActionType[] = ['create', 'update', 'delete', 'login', 'logout', 'restore']
      const entityTypes: EntityType[] = [
        'vehicle',
        'driver',
        'receipt',
        'payment',
        'document',
        'user',
        'agency',
        'system',
      ]

      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      // Générer 100 entrées d'historique
      for (let i = 0; i < 100; i++) {
        const action = actionTypes[Math.floor(Math.random() * actionTypes.length)]
        const targetType = entityTypes[Math.floor(Math.random() * entityTypes.length)]
        const user = users.value[Math.floor(Math.random() * users.value.length)]

        // Date aléatoire entre maintenant et une semaine
        const timestamp = new Date(
          oneWeekAgo.getTime() + Math.random() * (now.getTime() - oneWeekAgo.getTime()),
        )

        const item: HistoryItem = {
          id: `hist-${i}-${Math.random().toString(36).substring(2, 10)}`,
          timestamp,
          action,
          targetType,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }

        // Générer des données spécifiques selon le type d'action et d'entité
        if (targetType !== 'system') {
          item.targetId = `${targetType}-${Math.floor(Math.random() * 1000)}-${Math.random().toString(36).substring(2, 8)}`

          switch (targetType) {
            case 'vehicle':
              item.targetName = `Véhicule ${['Toyota Hiace', 'Mercedes Sprinter', 'Hyundai H1'][Math.floor(Math.random() * 3)]} - KN-${Math.floor(Math.random() * 999)}-AB`
              break
            case 'driver':
              item.targetName = `${['Jean', 'Pierre', 'Paul', 'Jacques', 'Robert'][Math.floor(Math.random() * 5)]} ${['Dupont', 'Martin', 'Bernard', 'Dubois', 'Thomas'][Math.floor(Math.random() * 5)]}`
              break
            case 'receipt':
              item.targetName = `Recette #${Math.floor(Math.random() * 10000)}`
              break
            case 'payment':
              item.targetName = `Paiement #${Math.floor(Math.random() * 10000)}`
              break
            case 'document':
              item.targetName = `Document ${['Assurance', 'Contrôle technique', 'Carte grise'][Math.floor(Math.random() * 3)]}`
              break
            case 'user':
              item.targetName = `${['Admin', 'Utilisateur', 'Manager', 'Superviseur'][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 100)}`
              break
            case 'agency':
              item.targetName = `Agence ${['Centrale', 'Nord', 'Sud', 'Est', 'Ouest'][Math.floor(Math.random() * 5)]}`
              break
          }
        }

        // Ajouter des changements pour les actions de mise à jour
        if (action === 'update') {
          item.changes = {}

          if (targetType === 'vehicle') {
            item.changes['status'] = {
              before: 'active',
              after: 'maintenance',
            }
            item.changes['lastMaintenanceDate'] = {
              before: new Date(2023, 3, 15).toISOString(),
              after: new Date().toISOString(),
            }
          } else if (targetType === 'driver') {
            item.changes['status'] = {
              before: 'active',
              after: 'inactive',
            }
            item.changes['phoneNumber'] = {
              before: '+243 9812345XX',
              after: '+243 9987654XX',
            }
          } else if (targetType === 'user') {
            item.changes['role'] = {
              before: 'user',
              after: 'admin',
            }
          }
        }

        mockData.push(item)
      }

      // Trier par date décroissante
      return mockData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    }

    // Filtres
    const filteredData = computed(() => {
      let data = [...historyData.value]

      // Filtre par type d'action
      if (activeTab.value !== 'all') {
        data = data.filter((item) => item.action === activeTab.value)
      }

      // Filtre par recherche
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        data = data.filter(
          (item) =>
            item.targetName?.toLowerCase().includes(query) ||
            item.userName.toLowerCase().includes(query) ||
            item.userEmail.toLowerCase().includes(query) ||
            item.targetType.toLowerCase().includes(query),
        )
      }

      // Filtre par date de début
      if (startDate.value) {
        data = data.filter((item) => item.timestamp >= startDate.value)
      }

      // Filtre par date de fin
      if (endDate.value) {
        const endOfDay = new Date(endDate.value)
        endOfDay.setHours(23, 59, 59, 999)
        data = data.filter((item) => item.timestamp <= endOfDay)
      }

      // Filtre par utilisateur
      if (userFilter.value) {
        data = data.filter((item) => item.userId === userFilter.value)
      }

      return data
    })

    // Total des éléments après filtrage
    const totalItems = computed(() => filteredData.value.length)

    // Nombre total de pages
    const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

    // Pages à afficher dans la pagination
    const displayedPages = computed(() => {
      const pages = []
      const maxPages = 5

      if (totalPages.value <= maxPages) {
        // Afficher toutes les pages si le total est inférieur ou égal au maximum
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i)
        }
      } else {
        // Sinon, afficher un sous-ensemble des pages
        if (currentPage.value <= 3) {
          // Près du début
          for (let i = 1; i <= 4; i++) {
            pages.push(i)
          }
          pages.push(totalPages.value)
        } else if (currentPage.value >= totalPages.value - 2) {
          // Près de la fin
          pages.push(1)
          for (let i = totalPages.value - 3; i <= totalPages.value; i++) {
            pages.push(i)
          }
        } else {
          // Au milieu
          pages.push(1)
          for (let i = currentPage.value - 1; i <= currentPage.value + 1; i++) {
            pages.push(i)
          }
          pages.push(totalPages.value)
        }
      }

      return pages
    })

    // Éléments paginés
    const filteredHistory = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredData.value.slice(start, end)
    })

    // Nombre d'éléments par type d'action
    const filterCounts = computed(() => {
      const counts = {
        all: historyData.value.length,
        create: 0,
        update: 0,
        delete: 0,
        login: 0,
        logout: 0,
        restore: 0,
      }

      historyData.value.forEach((item) => {
        if (counts[item.action] !== undefined) {
          counts[item.action]++
        }
      })

      return counts
    })

    // Réinitialiser les filtres
    const resetFilters = () => {
      activeTab.value = 'all'
      searchQuery.value = ''
      startDate.value = null
      endDate.value = null
      userFilter.value = ''
      currentPage.value = 1
    }

    // Appliquer les filtres
    const applyFilters = () => {
      currentPage.value = 1
      isFilterExpanded.value = false
    }

    // Afficher les détails d'une activité
    const showDetails = (item: HistoryItem) => {
      selectedItem.value = item
      detailsDialog.value = true
    }

    // Afficher du contenu JSON
    const viewJSON = (data: any) => {
      jsonContent.value = JSON.stringify(data, null, 2)
      jsonDialog.value = true
    }

    // Copier le JSON dans le presse-papier
    const copyJsonToClipboard = () => {
      navigator.clipboard
        .writeText(jsonContent.value)
        .then(() => {
          toastSuccess('Copié dans le presse-papier')
        })
        .catch(() => {
          toastError('Impossible de copier dans le presse-papier')
        })
    }

    // Exporter l'historique au format CSV
    const exportHistory = () => {
      // Générer les données CSV
      let csv = 'Date,Heure,Action,Type,Identifiant,Nom,Utilisateur,Email,IP\n'

      filteredData.value.forEach((item) => {
        const date = formatDate(item.timestamp)
        const time = formatTime(item.timestamp)
        const action = getActionName(item.action)
        const targetType = getEntityName(item.targetType)
        const row = [
          `"${date}"`,
          `"${time}"`,
          `"${action}"`,
          `"${targetType}"`,
          `"${item.targetId || ''}"`,
          `"${item.targetName || ''}"`,
          `"${item.userName}"`,
          `"${item.userEmail}"`,
          `"${item.ip}"`,
        ].join(',')

        csv += row + '\n'
      })

      // Créer un blob et télécharger
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `historique-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toastSuccess('Historique exporté avec succès')
    }

    // Formater la date (court format)
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }

    // Formater la date (format complet)
    const formatDateFull = (date: Date) => {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }

    // Formater l'heure
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    // Obtenir l'icône en fonction du type d'entité
    const getEntityIcon = (type: EntityType) => {
      switch (type) {
        case 'vehicle':
          return Car
        case 'driver':
        case 'user':
          return UserIcon
        case 'receipt':
        case 'payment':
        case 'document':
          return FileText
        default:
          return History
      }
    }

    // Obtenir le nom du type d'entité en français
    const getEntityName = (type: EntityType) => {
      switch (type) {
        case 'vehicle':
          return 'Véhicule'
        case 'driver':
          return 'Chauffeur'
        case 'receipt':
          return 'Recette'
        case 'payment':
          return 'Paiement'
        case 'document':
          return 'Document'
        case 'user':
          return 'Utilisateur'
        case 'agency':
          return 'Agence'
        case 'system':
          return 'Système'
        default:
          return type
      }
    }

    // Obtenir le nom de l'action en français
    const getActionName = (action: ActionType) => {
      switch (action) {
        case 'create':
          return 'Création'
        case 'update':
          return 'Modification'
        case 'delete':
          return 'Suppression'
        case 'restore':
          return 'Restauration'
        case 'login':
          return 'Connexion'
        case 'logout':
          return 'Déconnexion'
        default:
          return action
      }
    }

    // Obtenir la variante de badge selon le type d'action
    const getActionVariant = (action: ActionType) => {
      switch (action) {
        case 'create':
          return 'default'
        case 'update':
          return 'outline'
        case 'delete':
          return 'destructive'
        case 'restore':
          return 'secondary'
        case 'login':
          return 'default'
        case 'logout':
          return 'outline'
        default:
          return 'outline'
      }
    }

    // Vérifier si une valeur est un objet
    const isObject = (value: any) => {
      return value !== null && typeof value === 'object'
    }

    // Formater les noms de champ pour l'affichage
    const formatFieldName = (field: string) => {
      // Convertir camelCase en mots séparés avec majuscule
      return field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
    }

    // Formater les valeurs pour l'affichage
    const formatValue = (value: any) => {
      if (value === null || value === undefined) {
        return 'Non défini'
      }

      if (typeof value === 'boolean') {
        return value ? 'Oui' : 'Non'
      }

      if (
        value instanceof Date ||
        (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value))
      ) {
        try {
          const date = value instanceof Date ? value : new Date(value)
          return date.toLocaleString('fr-FR')
        } catch (e) {
          return value
        }
      }

      return value.toString()
    }

    // Charger les données initiales
    onMounted(() => {
      loadHistoryData()
    })

    return {
      historyData,
      isLoading,
      activeTab,
      searchQuery,
      isFilterExpanded,
      startDate,
      endDate,
      userFilter,
      detailsDialog,
      selectedItem,
      jsonDialog,
      jsonContent,
      currentPage,
      totalItems,
      totalPages,
      displayedPages,
      filteredHistory,
      filterCounts,
      users,
      resetFilters,
      applyFilters,
      showDetails,
      viewJSON,
      copyJsonToClipboard,
      exportHistory,
      formatDate,
      formatDateFull,
      formatTime,
      getEntityIcon,
      getEntityName,
      getActionName,
      getActionVariant,
      isObject,
      formatFieldName,
      formatValue,
      loadHistoryData,
    }
  },
})
</script>

<style scoped>
/* Styles personnalisés supplémentaires si nécessaire */
</style>
