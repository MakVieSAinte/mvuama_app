<template>
  <div class="space-y-8 min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-8">
    <!-- En-tête avec titre et description -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Corbeille</h1>
        <p class="text-muted-foreground">
          Les éléments supprimés sont conservés ici pendant 30 jours avant d'être définitivement
          supprimés.
        </p>
      </div>
    </div>

    <!-- Contenu principal -->
    <Card>
      <CardHeader class="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <CardTitle>Éléments supprimés</CardTitle>
          <CardDescription> Restaurez ou supprimez définitivement des éléments </CardDescription>
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

          <Button
            variant="outline"
            class="w-full md:w-auto"
            @click="loadDeletedItems"
            :disabled="isLoading"
          >
            <RefreshCw :class="{ 'animate-spin': isLoading }" class="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </CardHeader>

      <!-- Onglets de filtrage par type -->
      <div class="px-6">
        <Tabs v-model="activeTab" class="w-full custom-tabs">
          <TabsList class="w-full md:w-auto flex md:inline-flex overflow-x-auto">
            <TabsTrigger value="all" class="tab-trigger">
              Tous
              <Badge v-if="itemCounts.all > 0" variant="secondary" class="ml-2">
                {{ itemCounts.all }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="vehicle" class="tab-trigger">
              Véhicules
              <Badge v-if="itemCounts.vehicle > 0" variant="secondary" class="ml-2">
                {{ itemCounts.vehicle }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="driver" class="tab-trigger">
              Chauffeurs
              <Badge v-if="itemCounts.driver > 0" variant="secondary" class="ml-2">
                {{ itemCounts.driver }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="receipt" class="tab-trigger">
              Recettes
              <Badge v-if="itemCounts.receipt > 0" variant="secondary" class="ml-2">
                {{ itemCounts.receipt }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="payment" class="tab-trigger">
              Paiements
              <Badge v-if="itemCounts.payment > 0" variant="secondary" class="ml-2">
                {{ itemCounts.payment }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="document" class="tab-trigger">
              Documents
              <Badge v-if="itemCounts.document > 0" variant="secondary" class="ml-2">
                {{ itemCounts.document }}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CardContent>
        <!-- Actions en masse -->
        <div class="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div class="flex items-center">
            <Checkbox id="selectAll" :checked="selectAllItems" @update:checked="handleSelectAll" />
            <label for="selectAll" class="ml-2 text-sm font-medium">
              {{
                selectedItems.size > 0
                  ? `${selectedItems.size} élément${selectedItems.size > 1 ? 's' : ''} sélectionné${selectedItems.size > 1 ? 's' : ''}`
                  : 'Sélectionner tout'
              }}
            </label>
          </div>

          <div class="flex items-center gap-2" v-if="selectedItems.size > 0">
            <Button variant="outline" size="sm" @click="bulkAction('restore')">
              <RefreshCw class="mr-2 h-4 w-4" />
              Restaurer la sélection
            </Button>
            <Button variant="destructive" size="sm" @click="bulkAction('delete')">
              <Trash2 class="mr-2 h-4 w-4" />
              Supprimer la sélection
            </Button>
          </div>
        </div>

        <!-- Tableau des éléments supprimés -->
        <div class="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[40px]"></TableHead>
                <TableHead>Nom</TableHead>
                <TableHead class="hidden md:table-cell">Type</TableHead>
                <TableHead class="hidden md:table-cell">Supprimé par</TableHead>
                <TableHead class="hidden lg:table-cell">Date de suppression</TableHead>
                <TableHead class="hidden lg:table-cell">Jours restants</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <!-- Message de chargement -->
              <TableRow v-if="isLoading">
                <TableCell colspan="7" class="h-24 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <RefreshCw class="h-6 w-6 animate-spin text-primary" />
                    <span class="mt-2">Chargement des éléments supprimés...</span>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Message vide -->
              <TableRow v-else-if="filteredItems.length === 0">
                <TableCell colspan="7" class="h-24 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <TrashIcon class="h-10 w-10 text-muted-foreground/50 mb-2" />
                    <span class="text-muted-foreground">La corbeille est vide</span>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Liste des éléments supprimés -->
              <TableRow v-for="item in filteredItems" :key="item.id">
                <TableCell>
                  <Checkbox
                    :id="`select-${item.id}`"
                    :checked="selectedItems.has(item.id)"
                    @update:checked="(checked) => handleSelectItem(item.id, checked)"
                  />
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <component :is="getItemIcon(item.type)" class="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div class="font-medium">{{ item.name }}</div>
                      <div class="text-xs text-muted-foreground md:hidden">
                        {{ getTypeName(item.type) }}
                      </div>
                      <div class="text-xs text-muted-foreground mt-1">
                        {{ getMetadataDisplay(item) }}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell class="hidden md:table-cell">
                  {{ getTypeName(item.type) }}
                </TableCell>
                <TableCell class="hidden md:table-cell">
                  {{ item.deleteBy }}
                </TableCell>
                <TableCell class="hidden lg:table-cell">
                  <div class="flex items-center gap-1">
                    <Clock class="h-3 w-3 text-muted-foreground" />
                    <span class="whitespace-nowrap">
                      {{ formatRelativeTime(item.deletedAt) }}
                    </span>
                  </div>
                </TableCell>
                <TableCell class="hidden lg:table-cell">
                  <Badge
                    :variant="getDaysRemaining(item.expiresAt) < 7 ? 'destructive' : 'outline'"
                  >
                    {{ getDaysRemaining(item.expiresAt) }} jour{{
                      getDaysRemaining(item.expiresAt) > 1 ? 's' : ''
                    }}
                  </Badge>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Restaurer"
                      @click="((selectedItemForAction = item), (restoreDialog = true))"
                    >
                      <RefreshCw class="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Supprimer définitivement"
                      @click="((selectedItemForAction = item), (permanentDeleteDialog = true))"
                    >
                      <Trash2 class="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter
        class="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t pt-6"
      >
        <Button
          variant="destructive"
          @click="((selectedItemForAction = null), (permanentDeleteDialog = true))"
          :disabled="deletedItems.length === 0"
        >
          <Trash2 class="mr-2 h-4 w-4" />
          Vider la corbeille
        </Button>

        <p class="text-sm text-muted-foreground">
          {{ filteredItems.length }} élément{{ filteredItems.length !== 1 ? 's' : '' }}
          {{ activeTab === 'all' ? '' : `de type "${getTypeName(activeTab)}" ` }}dans la corbeille
        </p>
      </CardFooter>
    </Card>
  </div>

  <!-- Dialog de confirmation pour restaurer -->
  <AlertDialog v-model:open="restoreDialog">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {{
            selectedItems.size > 0
              ? `Restaurer ${selectedItems.size} élément${selectedItems.size > 1 ? 's' : ''}?`
              : `Restaurer "${selectedItemForAction?.name}"?`
          }}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {{
            selectedItems.size > 0
              ? `Les ${selectedItems.size} élément${selectedItems.size > 1 ? 's' : ''} sélectionné${selectedItems.size > 1 ? 's' : ''} ser${selectedItems.size > 1 ? 'ont' : 'a'} restauré${selectedItems.size > 1 ? 's' : ''} à leur emplacement d'origine.`
              : `L'élément sera restauré à son emplacement d'origine.`
          }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Annuler</AlertDialogCancel>
        <AlertDialogAction v-if="selectedItems.size > 0" @click="executeBulkAction">
          Restaurer
        </AlertDialogAction>
        <AlertDialogAction
          v-else-if="selectedItemForAction"
          @click="
            (restoreItem(selectedItemForAction),
            (restoreDialog = false),
            (selectedItemForAction = null))
          "
        >
          Restaurer
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  <!-- Dialog de confirmation pour supprimer définitivement -->
  <AlertDialog v-model:open="permanentDeleteDialog">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {{
            selectedItems.size > 0
              ? `Supprimer définitivement ${selectedItems.size} élément${selectedItems.size > 1 ? 's' : ''}?`
              : selectedItemForAction
                ? `Supprimer définitivement "${selectedItemForAction?.name}"?`
                : 'Vider entièrement la corbeille?'
          }}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {{
            selectedItems.size > 0
              ? `Les ${selectedItems.size} élément${selectedItems.size > 1 ? 's' : ''} sélectionné${selectedItems.size > 1 ? 's' : ''} ser${selectedItems.size > 1 ? 'ont' : 'a'} définitivement supprimé${selectedItems.size > 1 ? 's' : ''} et ne pourr${selectedItems.size > 1 ? 'ont' : 'a'} pas être récupéré${selectedItems.size > 1 ? 's' : ''}.`
              : selectedItemForAction
                ? `L'élément sera définitivement supprimé et ne pourra pas être récupéré.`
                : `Tous les éléments de la corbeille seront définitivement supprimés et ne pourront pas être récupérés. Cette action est irréversible.`
          }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Annuler</AlertDialogCancel>
        <AlertDialogAction
          v-if="selectedItems.size > 0"
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          @click="executeBulkAction"
        >
          Supprimer définitivement
        </AlertDialogAction>
        <AlertDialogAction
          v-else-if="selectedItemForAction"
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          @click="
            (permanentDeleteItem(selectedItemForAction),
            (permanentDeleteDialog = false),
            (selectedItemForAction = null))
          "
        >
          Supprimer définitivement
        </AlertDialogAction>
        <AlertDialogAction
          v-else
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          @click="(emptyTrash(), (permanentDeleteDialog = false))"
        >
          Vider la corbeille
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { useSonner } from '@/plugins/sonner'
import {
  Search,
  MoreVertical,
  AlertCircle,
  Clock,
  Car,
  User,
  FileText,
  TrashIcon,
  RefreshCw,
  Trash2,
} from 'lucide-vue-next'
import '@/assets/css/custom-tabs.css'

// Définition des types
type ItemType = 'vehicle' | 'driver' | 'receipt' | 'payment' | 'document'

interface DeletedItem {
  id: string
  name: string
  type: ItemType
  deletedAt: Date
  deleteBy: string
  expiresAt: Date
  metadata: Record<string, any>
}

// Les composants sont importés via les imports en haut du script

// Initialiser le toast
const { toastSuccess, toastError } = useSonner()

// État des données
const deletedItems = ref<DeletedItem[]>([])
const isLoading = ref(false)
const activeTab = ref<ItemType | 'all'>('all')
const searchQuery = ref('')
const selectedItems = ref<Set<string>>(new Set())
const selectAllItems = ref(false)
const permanentDeleteDialog = ref(false)
const restoreDialog = ref(false)
const selectedItemForAction = ref<DeletedItem | null>(null)
const bulkActionType = ref<'restore' | 'delete' | null>(null)

// Données de test pour simulation
const generateMockData = () => {
  const types: ItemType[] = ['vehicle', 'driver', 'receipt', 'payment', 'document']
  const mockData: DeletedItem[] = []

  const now = new Date()

  // Générer des données pour chaque type
  types.forEach((type) => {
    const count = type === 'document' ? 8 : type === 'vehicle' ? 5 : 3

    for (let i = 1; i <= count; i++) {
      const deletedAt = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Entre maintenant et 30 jours avant
      const expiresAt = new Date(deletedAt.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 jours après la suppression

      let name = ''
      let metadata: Record<string, any> = {}

      switch (type) {
        case 'vehicle':
          name = `Véhicule ${['Toyota Hiace', 'Mercedes Sprinter', 'Hyundai H1', 'Nissan Urvan', 'Ford Transit'][i % 5]} - ${['KN-123-AB', 'KN-456-CD', 'KN-789-EF', 'KN-012-GH', 'KN-345-IJ'][i % 5]}`
          metadata = {
            licensePlate: `KN-${(100 + i * 111).toString().padStart(3, '0')}-${String.fromCharCode(65 + i)}${String.fromCharCode(66 + i)}`,
            model: [
              'Toyota Hiace',
              'Mercedes Sprinter',
              'Hyundai H1',
              'Nissan Urvan',
              'Ford Transit',
            ][i % 5],
            year: 2015 + (i % 8),
          }
          break
        case 'driver':
          name = `Chauffeur ${['Jean', 'Pierre', 'Paul', 'Jacques', 'Robert'][i % 5]} ${['Dupont', 'Martin', 'Bernard', 'Dubois', 'Thomas'][i % 5]}`
          metadata = {
            phone: `+243 9${(i * 11111111).toString().substring(0, 8)}`,
            license: `DL-${(1000 + i * 111).toString()}`,
            joinedAt: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toISOString().split('T')[0],
          }
          break
        case 'receipt':
          name = `Recette #${(1000 + i).toString()}`
          metadata = {
            amount: (50 + i * 10) * 1000,
            date: new Date(2023, i % 12, (i % 28) + 1).toISOString().split('T')[0],
            vehicle: `KN-${(100 + (i % 5) * 111).toString().padStart(3, '0')}-${String.fromCharCode(65 + (i % 5))}${String.fromCharCode(66 + (i % 5))}`,
          }
          break
        case 'payment':
          name = `Paiement #${(2000 + i).toString()}`
          metadata = {
            amount: (100 + i * 20) * 1000,
            date: new Date(2023, i % 12, (i % 28) + 1).toISOString().split('T')[0],
            method: ['Cash', 'Mobile Money', 'Carte bancaire', 'Virement', 'Chèque'][i % 5],
          }
          break
        case 'document':
          name = `Document ${['Assurance', 'Contrôle technique', 'Carte grise', 'Contrat', 'Facture', 'Rapport', 'Fiche technique', 'Permis de conduire'][i % 8]}`
          metadata = {
            type: ['PDF', 'DOC', 'JPEG', 'PNG', 'XLSX'][i % 5],
            size: `${100 + i * 150}Ko`,
            createdAt: new Date(2022 + (i % 3), i % 12, (i % 28) + 1).toISOString().split('T')[0],
          }
          break
      }

      mockData.push({
        id: `${type}-${i}-${Math.random().toString(36).substring(2, 10)}`,
        name,
        type,
        deletedAt,
        deleteBy: ['admin@mvuama.com', 'manager@mvuama.com', 'supervisor@mvuama.com'][i % 3],
        expiresAt,
        metadata,
      })
    }
  })

  return mockData
}

// Charger les données
onMounted(() => {
  loadDeletedItems()
})

// Charger les éléments supprimés (simulation)
const loadDeletedItems = async () => {
  isLoading.value = true
  try {
    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 800))

    deletedItems.value = generateMockData()
  } catch (error) {
    console.error('Erreur lors du chargement des éléments supprimés', error)
    toastError('Impossible de charger les éléments supprimés')
  } finally {
    isLoading.value = false
  }
}

// Éléments filtrés
const filteredItems = computed(() => {
  let items = [...deletedItems.value]

  // Filtrer par type
  if (activeTab.value !== 'all') {
    items = items.filter((item) => item.type === activeTab.value)
  }

  // Filtrer par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(
      (item) => item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query),
    )
  }

  // Trier par date de suppression (plus récent en premier)
  items.sort((a, b) => b.deletedAt.getTime() - a.deletedAt.getTime())

  return items
})

// Nombre d'éléments par type
const itemCounts = computed(() => {
  const counts = {
    all: deletedItems.value.length,
    vehicle: 0,
    driver: 0,
    receipt: 0,
    payment: 0,
    document: 0,
  }

  deletedItems.value.forEach((item) => {
    counts[item.type]++
  })

  return counts
})

// Gérer la sélection de tous les éléments
const handleSelectAll = (checked: boolean) => {
  selectAllItems.value = checked

  if (checked) {
    // Sélectionner tous les éléments filtrés
    filteredItems.value.forEach((item) => {
      selectedItems.value.add(item.id)
    })
  } else {
    // Désélectionner tous les éléments
    selectedItems.value.clear()
  }
}

// Gérer la sélection d'un élément
const handleSelectItem = (id: string, checked: boolean) => {
  if (checked) {
    selectedItems.value.add(id)
  } else {
    selectedItems.value.delete(id)
  }

  // Mettre à jour l'état de sélection de tous les éléments
  selectAllItems.value =
    filteredItems.value.length > 0 &&
    filteredItems.value.every((item) => selectedItems.value.has(item.id))
}

// Restaurer un élément
const restoreItem = async (item: DeletedItem) => {
  try {
    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Retirer l'élément de la liste
    deletedItems.value = deletedItems.value.filter((i) => i.id !== item.id)
    selectedItems.value.delete(item.id)

    toastSuccess(`"${item.name}" a été restauré avec succès`)
  } catch (error) {
    console.error("Erreur lors de la restauration de l'élément", error)
    toastError("Impossible de restaurer l'élément")
  }
}

// Supprimer définitivement un élément
const permanentDeleteItem = async (item: DeletedItem) => {
  try {
    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Retirer l'élément de la liste
    deletedItems.value = deletedItems.value.filter((i) => i.id !== item.id)
    selectedItems.value.delete(item.id)

    toastSuccess(`"${item.name}" a été définitivement supprimé`)
  } catch (error) {
    console.error("Erreur lors de la suppression définitive de l'élément", error)
    toastError("Impossible de supprimer définitivement l'élément")
  }
}

// Action sur tous les éléments sélectionnés
const bulkAction = async (action: 'restore' | 'delete') => {
  if (selectedItems.value.size === 0) {
    toastError('Aucun élément sélectionné')
    return
  }

  bulkActionType.value = action

  if (action === 'restore') {
    restoreDialog.value = true
  } else {
    permanentDeleteDialog.value = true
  }
}

// Exécuter l'action en masse
const executeBulkAction = async () => {
  if (selectedItems.value.size === 0 || !bulkActionType.value) {
    return
  }

  try {
    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const count = selectedItems.value.size
    const itemsToProcess = deletedItems.value.filter((item) => selectedItems.value.has(item.id))

    // Retirer les éléments de la liste
    deletedItems.value = deletedItems.value.filter((item) => !selectedItems.value.has(item.id))

    // Vider la sélection
    selectedItems.value.clear()
    selectAllItems.value = false

    // Fermer les dialogues
    restoreDialog.value = false
    permanentDeleteDialog.value = false

    const action = bulkActionType.value === 'restore' ? 'restaurés' : 'supprimés définitivement'
    toastSuccess(`${count} élément${count > 1 ? 's' : ''} ${action} avec succès`)
  } catch (error) {
    console.error("Erreur lors de l'action en masse", error)
    toastError("Impossible d'exécuter l'action en masse")
  } finally {
    bulkActionType.value = null
  }
}

// Format relatif pour les dates
const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Il y a quelques secondes'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  } else {
    return date.toLocaleDateString('fr-FR')
  }
}

// Format de date standard
const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Obtenir l'icône en fonction du type d'élément
const getItemIcon = (type: ItemType) => {
  switch (type) {
    case 'vehicle':
      return Car
    case 'driver':
      return User
    case 'receipt':
      return FileText
    case 'payment':
      return FileText
    case 'document':
      return FileText
    default:
      return AlertCircle
  }
}

// Obtenir le nom du type en français
const getTypeName = (type: ItemType) => {
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
    default:
      return type
  }
}

// Jours restants avant suppression définitive
const getDaysRemaining = (expiresAt: Date) => {
  const now = new Date()
  const diffInDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffInDays > 0 ? diffInDays : 0
}

// Afficher les métadonnées en fonction du type
const getMetadataDisplay = (item: DeletedItem) => {
  const { type, metadata } = item

  switch (type) {
    case 'vehicle':
      return `${metadata.model}, ${metadata.year} (${metadata.licensePlate})`
    case 'driver':
      return `${metadata.phone}, Permis: ${metadata.license}`
    case 'receipt':
      return `${metadata.amount.toLocaleString('fr-FR')} CDF, ${metadata.date}, Véhicule: ${metadata.vehicle}`
    case 'payment':
      return `${metadata.amount.toLocaleString('fr-FR')} CDF, ${metadata.date}, ${metadata.method}`
    case 'document':
      return `${metadata.type}, ${metadata.size}, Créé le ${metadata.createdAt}`
    default:
      return JSON.stringify(metadata)
  }
}

// Vider la corbeille entièrement (tous les éléments)
const emptyTrash = async () => {
  try {
    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const count = deletedItems.value.length

    // Vider la liste
    deletedItems.value = []
    selectedItems.value.clear()

    toastSuccess(
      `La corbeille a été vidée (${count} élément${count > 1 ? 's' : ''} supprimé${count > 1 ? 's' : ''})`,
    )
  } catch (error) {
    console.error('Erreur lors du vidage de la corbeille', error)
    toastError('Impossible de vider la corbeille')
  }
}
</script>
