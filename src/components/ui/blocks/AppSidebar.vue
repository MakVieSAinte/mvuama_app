<script setup lang="ts">
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  ChartArea,
  Car,
  CheckSquare,
  MapPin,
  File,
  Bell,
  History,
  Route,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Users,
  Coins,
  Wallet,
} from 'lucide-vue-next'

import NavMain from '@/components/ui/blocks/NavMain.vue'
import NavSecondary from '@/components/ui/blocks/NavSecondary.vue'
import TeamSwitcher from '@/components/ui/blocks/TeamSwitcher.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  type SidebarProps,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'

import { ref, watchEffect, onMounted } from 'vue'
import { defineEmits } from 'vue'
import Switch from '@/components/ui/switch/Switch.vue'

const props = defineProps<SidebarProps & { activeTab: string }>()

// Gestion du thème persistant
function getInitialTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') return true
  if (savedTheme === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}
const isDark = ref(getInitialTheme())

const emit = defineEmits(['tab-change'])
function handleTabChange(tabId: string) {
  emit('tab-change', tabId)
}

// Sur changement, appliquer la classe et sauvegarder
const data = {
  teams: [
    {
      name: 'Agence de moungali',
      logo: Command,
      plan: 'Enterprise',
    },
    {
      name: 'Agence de Bacongo',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Agence de Poto-Poto',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    { id: 'home', title: 'Accueil', icon: Home, route: '/home' },
    { id: 'dashboard', title: 'Tableau de bord', icon: ChartArea, route: '/dashboard' },
    { id: 'vehicles', title: 'Véhicules', icon: Car, route: '/vehicles' },
    { id: 'conducteurs', title: 'Conducteurs', icon: Users, route: '/conducteurs' },
    { id: 'documents', title: 'Documents', icon: File, route: '/documents' },
    { id: 'recettes', title: 'Recettes', icon: Coins, route: '/recettes' },
    { id: 'paiements', title: 'Paiements', icon: Wallet, route: '/paiements' },
    { id: 'maintenance', title: 'Entretiens', icon: Calendar, route: '/maintenance' },
    { id: 'checklist', title: 'Checklists', icon: CheckSquare, route: '/checklist' },
    { id: 'gps', title: 'GPS', icon: Route, route: '/gps', disabled: true },
    { id: 'alertes', title: 'Alertes & Notifications', icon: Bell, route: '/alertes' },
    { id: 'parking', title: 'Parking', icon: MapPin, route: '/parking' },
    { id: 'historique', title: 'Historique générale', icon: History, route: '/historique' },
  ],
  navSecondary: [
    // {
    //   title: 'Inbox',
    //   url: '#',
    //   icon: Inbox,
    // },
    {
      title: 'Configuration',
      url: '/configuration',
      icon: Settings2,
    },
    {
      title: 'Corbeille',
      url: '#',
      icon: Trash2,
    },
    {
      title: 'Vous avez besoin d’aide ?',
      url: '#',
      icon: MessageCircleQuestion,
    },
  ],
}
</script>

<template>
  <Sidebar class="border-r-0" v-bind="props">
    <SidebarHeader>
      <div class="flex items-center justify-between">
        <TeamSwitcher :teams="data.teams" class="w-full" />
      </div>
      <nav class="mt-4">
        <SidebarMenu>
          <SidebarMenuItem v-for="item in data.navMain" :key="item.id">
            <SidebarMenuButton as-child>
              <router-link
                v-if="!item.disabled"
                :to="item.route"
                :data-active="$route.path === item.route"
                class="flex items-center gap-2 w-full"
              >
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
              </router-link>
              <div
                v-else
                class="flex items-center gap-2 w-full text-gray-400 cursor-not-allowed opacity-60 select-none"
              >
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </nav>
    </SidebarHeader>
    <SidebarContent>
      <NavSecondary :items="data.navSecondary" class="mt-auto" />
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
