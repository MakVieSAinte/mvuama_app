<script setup lang="ts">
import { ref, computed } from 'vue'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { useSonner } from '@/plugins/sonner'
import { FileDown, Search, ArrowDown, ArrowUp } from 'lucide-vue-next'

const { toastSuccess, toastError } = useSonner()

// Types pour les factures
interface Invoice {
  id: string
  date: Date
  amount: number
  planName: string
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  paymentMethod: string
}

// Factures
const invoices = ref<Invoice[]>([
  {
    id: 'INV-2024-1001',
    date: new Date('2024-08-15'),
    amount: 49.99,
    planName: 'Standard',
    status: 'paid',
    paymentMethod: 'Visa ••••4242',
  },
  {
    id: 'INV-2024-0975',
    date: new Date('2024-07-15'),
    amount: 49.99,
    planName: 'Standard',
    status: 'paid',
    paymentMethod: 'Visa ••••4242',
  },
  {
    id: 'INV-2024-0850',
    date: new Date('2024-06-15'),
    amount: 24.99,
    planName: 'Basique',
    status: 'paid',
    paymentMethod: 'Visa ••••4242',
  },
  {
    id: 'INV-2024-0722',
    date: new Date('2024-05-15'),
    amount: 24.99,
    planName: 'Basique',
    status: 'paid',
    paymentMethod: 'Visa ••••4242',
  },
  {
    id: 'INV-2024-0650',
    date: new Date('2024-04-15'),
    amount: 24.99,
    planName: 'Basique',
    status: 'paid',
    paymentMethod: 'Visa ••••4242',
  },
  {
    id: 'INV-2024-0534',
    date: new Date('2024-03-15'),
    amount: 24.99,
    planName: 'Basique',
    status: 'refunded',
    paymentMethod: 'Visa ••••4242',
  },
])

// Filtres
const searchQuery = ref('')
const statusFilter = ref('all')
const sortField = ref('date')
const sortDirection = ref('desc')
const currentPage = ref(1)
const perPage = ref(5)

// Obtenir le badge de statut
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return {
        label: 'Payée',
        class:
          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30',
      }
    case 'pending':
      return {
        label: 'En attente',
        class:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
      }
    case 'failed':
      return {
        label: 'Échouée',
        class:
          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30',
      }
    case 'refunded':
      return {
        label: 'Remboursée',
        class:
          'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30',
      }
    default:
      return { label: status, class: '' }
  }
}

// Formatage de la date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Formatage du montant
const formatAmount = (amount: number) => {
  return amount.toFixed(2) + ' €'
}

// Télécharger une facture
const downloadInvoice = (invoiceId: string) => {
  toastSuccess(`Téléchargement de la facture ${invoiceId}`)
  // Logique de téléchargement à implémenter
}

// Trier les factures
const toggleSort = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'desc'
  }
}

// Factures filtrées et triées
const filteredInvoices = computed(() => {
  let result = [...invoices.value]

  // Recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (invoice) =>
        invoice.id.toLowerCase().includes(query) ||
        invoice.planName.toLowerCase().includes(query) ||
        invoice.paymentMethod.toLowerCase().includes(query),
    )
  }

  // Filtre par statut
  if (statusFilter.value !== 'all') {
    result = result.filter((invoice) => invoice.status === statusFilter.value)
  }

  // Tri
  result.sort((a, b) => {
    let comparison = 0

    if (sortField.value === 'date') {
      comparison = a.date.getTime() - b.date.getTime()
    } else if (sortField.value === 'amount') {
      comparison = a.amount - b.amount
    } else if (sortField.value === 'id') {
      comparison = a.id.localeCompare(b.id)
    }

    return sortDirection.value === 'desc' ? -comparison : comparison
  })

  return result
})

// Factures paginées
const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredInvoices.value.slice(start, end)
})

// Total de pages
const totalPages = computed(() => {
  return Math.ceil(filteredInvoices.value.length / perPage.value)
})

// Navigation entre les pages
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Réinitialiser les filtres
const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  currentPage.value = 1
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Historique de paiements</CardTitle>
      <CardDescription> Consultez et téléchargez vos factures </CardDescription>
    </CardHeader>

    <CardContent>
      <!-- Filtres -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="relative w-full sm:max-w-[300px]">
          <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input v-model="searchQuery" placeholder="Rechercher une facture..." class="pl-8" />
        </div>

        <Select v-model="statusFilter">
          <SelectTrigger class="w-full sm:w-[180px]">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="paid">Payée</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="failed">Échouée</SelectItem>
            <SelectItem value="refunded">Remboursée</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          class="ml-auto hidden sm:flex"
          @click="resetFilters"
          :disabled="!searchQuery && statusFilter === 'all'"
        >
          Réinitialiser les filtres
        </Button>
      </div>

      <!-- Tableau des factures -->
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[150px] cursor-pointer" @click="toggleSort('id')">
                <div class="flex items-center gap-1">
                  Numéro
                  <span v-if="sortField === 'id'">
                    <ArrowUp v-if="sortDirection === 'asc'" class="h-3 w-3" />
                    <ArrowDown v-else class="h-3 w-3" />
                  </span>
                </div>
              </TableHead>
              <TableHead class="cursor-pointer" @click="toggleSort('date')">
                <div class="flex items-center gap-1">
                  Date
                  <span v-if="sortField === 'date'">
                    <ArrowUp v-if="sortDirection === 'asc'" class="h-3 w-3" />
                    <ArrowDown v-else class="h-3 w-3" />
                  </span>
                </div>
              </TableHead>
              <TableHead>Plan</TableHead>
              <TableHead class="cursor-pointer" @click="toggleSort('amount')">
                <div class="flex items-center gap-1">
                  Montant
                  <span v-if="sortField === 'amount'">
                    <ArrowUp v-if="sortDirection === 'asc'" class="h-3 w-3" />
                    <ArrowDown v-else class="h-3 w-3" />
                  </span>
                </div>
              </TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="paginatedInvoices.length === 0">
              <TableCell colspan="7" class="text-center h-24 text-muted-foreground">
                Aucune facture trouvée
              </TableCell>
            </TableRow>
            <TableRow v-for="invoice in paginatedInvoices" :key="invoice.id">
              <TableCell class="font-medium">{{ invoice.id }}</TableCell>
              <TableCell>{{ formatDate(invoice.date) }}</TableCell>
              <TableCell>{{ invoice.planName }}</TableCell>
              <TableCell>{{ formatAmount(invoice.amount) }}</TableCell>
              <TableCell>
                <Badge :class="getStatusBadge(invoice.status).class">
                  {{ getStatusBadge(invoice.status).label }}
                </Badge>
              </TableCell>
              <TableCell>{{ invoice.paymentMethod }}</TableCell>
              <TableCell class="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="downloadInvoice(invoice.id)"
                  title="Télécharger la facture"
                >
                  <FileDown class="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-4">
        <p class="text-sm text-muted-foreground">
          Affichage de {{ paginatedInvoices.length }} sur {{ filteredInvoices.length }} facture{{
            filteredInvoices.length > 1 ? 's' : ''
          }}
        </p>

        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" @click="prevPage" :disabled="currentPage <= 1">
            Précédent
          </Button>
          <span class="text-sm"> Page {{ currentPage }} sur {{ totalPages }} </span>
          <Button
            variant="outline"
            size="sm"
            @click="nextPage"
            :disabled="currentPage >= totalPages"
          >
            Suivant
          </Button>
        </div>
      </div>
    </CardContent>

    <CardFooter
      class="flex flex-col sm:flex-row gap-3 sm:justify-between items-center border-t pt-6"
    >
      <p class="text-sm text-muted-foreground">
        Besoin d'une facture spécifique ? Contactez notre support.
      </p>
      <Button>Exporter toutes les factures</Button>
    </CardFooter>
  </Card>
</template>
