<script setup lang="ts">
import type { Component } from 'vue'

import { Building, ChevronsUpDown, Plus } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import { EnterpriseService } from '@/services/enterprise/enterpriseService'

// Accepte des équipes de test mais n'est pas obligatoire
// Accepte des équipes pour rétrocompatibilité mais on n'utilisera pas ce prop
defineProps<{
  teams?: {
    name: string
    logo: Component
    plan: string
  }[]
}>()

const { isMobile } = useSidebar()
const router = useRouter()

// États réactifs
const agencies = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Agence active
const activeAgencyId = ref<string | null>(localStorage.getItem('current_agency_id') || null)
const activeAgencyName = ref<string | null>(
  localStorage.getItem('current_agency_name') || 'Mon agence',
)

// Équipe active calculée
const activeTeam = computed(() => {
  // Si on a une agence active dans les agences chargées, on l'utilise
  if (agencies.value.length > 0) {
    const found = agencies.value.find((agency) => agency.id === activeAgencyId.value)
    if (found) {
      return {
        id: found.id,
        name: found.name,
        logo: Building,
        plan: found.type || 'Standard',
      }
    }
  }

  // Sinon on utilise les données stockées localement
  return {
    id: activeAgencyId.value,
    name: activeAgencyName.value || 'Mon agence',
    logo: Building,
    plan: 'Standard',
  }
})

// Charger les agences de l'utilisateur
onMounted(async () => {
  try {
    loading.value = true
    const response = await EnterpriseService.getUserEnterprises()

    if (response.data) {
      agencies.value = response.data

      // Si on n'a pas d'agence active mais qu'on a des agences, on définit la première comme active
      if (!activeAgencyId.value && agencies.value.length > 0) {
        activeAgencyId.value = agencies.value[0].id
        activeAgencyName.value = agencies.value[0].name
        localStorage.setItem('current_agency_id', agencies.value[0].id)
        localStorage.setItem('current_agency_name', agencies.value[0].name)
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement des agences'
    console.error('Erreur lors du chargement des agences:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <component :is="activeTeam.logo" class="size-4" />
              <span v-if="loading" class="animate-pulse">...</span>
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">
                {{ activeTeam.name }}
              </span>
              <span class="truncate text-xs">{{ activeTeam.plan }}</span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
        >
          <DropdownMenuLabel class="text-xs text-muted-foreground">Mes agences</DropdownMenuLabel>

          <!-- Liste des agences chargées depuis la base de données -->
          <div v-if="loading" class="flex justify-center py-2">
            <span class="text-xs text-muted-foreground">Chargement...</span>
          </div>

          <div v-else-if="error" class="flex justify-center py-2">
            <span class="text-xs text-red-500">{{ error }}</span>
          </div>

          <div v-else-if="agencies.length === 0" class="flex justify-center py-2">
            <span class="text-xs text-muted-foreground">Aucune agence trouvée</span>
          </div>

          <template v-else>
            <DropdownMenuItem
              v-for="agency in agencies"
              :key="agency.id"
              class="gap-2 p-2"
              @click="
                () => {
                  activeAgencyId = agency.id
                  activeAgencyName = agency.name
                  localStorage.setItem('current_agency_id', agency.id)
                  localStorage.setItem('current_agency_name', agency.name)
                }
              "
            >
              <div class="flex size-6 items-center justify-center rounded-sm border">
                <Building class="size-4 shrink-0" />
              </div>
              {{ agency.name }}
              <DropdownMenuShortcut v-if="agency.id === activeAgencyId">✓</DropdownMenuShortcut>
            </DropdownMenuItem>
          </template>

          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 p-2" @click="router.push('/create-agency')">
            <div class="flex size-6 items-center justify-center rounded-md border bg-background">
              <Plus class="size-4" />
            </div>
            <div class="font-medium text-muted-foreground">Ajouter une agence</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
