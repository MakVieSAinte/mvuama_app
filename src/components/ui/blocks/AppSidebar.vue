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
      name: 'Acme Inc',
      logo: Command,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    { id: 'home', title: 'Accueil', icon: Home, route: '/home' },
    { id: 'dashboard', title: 'Tableau de bord', icon: ChartArea, route: '/dashboard' },
    { id: 'vehicles', title: 'Véhicules', icon: Car, route: '/vehicles' },
    { id: 'chauffeurs', title: 'Chauffeurs', icon: Users, route: '/chauffeurs' },
    { id: 'recettes', title: 'Recettes', icon: Coins, route: '/recettes' },
    { id: 'paiements', title: 'Paiements', icon: Wallet, route: '/paiements' },
    { id: 'maintenance', title: 'Entretiens', icon: Calendar, route: '/maintenance' },
    { id: 'checklist', title: 'Checklists', icon: CheckSquare, route: '/checklist' },
    { id: 'parking', title: 'Parking', icon: MapPin, route: '/parking' },
  ],
  navSecondary: [
    // {
    //   title: 'Inbox',
    //   url: '#',
    //   icon: Inbox,
    // },
    {
      title: 'Paramètres',
      url: '#',
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
        <TeamSwitcher :teams="data.teams" />
        <Switch v-model="isDark" :label="isDark ? 'Dark' : 'Light'" class="ml-2" />
      </div>
      <nav class="mt-4">
        <SidebarMenu>
          <SidebarMenuItem v-for="item in data.navMain" :key="item.id">
            <SidebarMenuButton as-child>
              <router-link
                :to="item.route"
                :data-active="$route.path === item.route"
                class="flex items-center gap-2 w-full"
              >
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
              </router-link>
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
