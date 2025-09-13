<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import AppSidebar from '@/components/ui/blocks/AppSidebar.vue'
import NavActions from '@/components/ui/blocks/NavActions.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const route = useRoute()
const pageNames: Record<string, string> = {
  home: 'Accueil',
  dashboard: 'Dashboard',
  vehicles: 'Véhicules',
  maintenance: 'Maintenance',
  checklist: 'Checklist',
  parking: 'Parking',
  drivers: 'Conducteurs',
  recettes: 'Recettes',
  payment: 'Paiements',
  documents: 'Documents',
  gps: 'GPS',
  alertes: 'Alertes & Notifications',
  historique: 'Historique',
  configuration: 'Configuration',
  profile: 'Profil Utilisateur',
  subscription: 'Abonnement',
  notifications: 'Notifications',
  trash: 'Corbeille',
  help: "Centre d'aide", 
}
const currentPage = computed(() => pageNames[route.name as string] || '')
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-14 shrink-0 items-center gap-1">
        <div class="flex flex-1 items-center gap-0 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage class="line-clamp-1">Gestion de Flotte Automobile</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage class="line-clamp-1">{{ currentPage }}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div class="ml-auto px-3">
          <NavActions />
        </div>
      </header>
      <RouterView />
    </SidebarInset>
  </SidebarProvider>
</template>
