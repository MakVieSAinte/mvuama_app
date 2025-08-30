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
  Fuel,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  User,
} from 'lucide-vue-next'

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
  useSidebar,
} from '@/components/ui/sidebar'

import { defineComponent } from 'vue'
import { defineEmits } from 'vue'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const props = defineProps<SidebarProps & { activeTab: string }>()

// Information utilisateur pour le dropdown
const { isMobile } = useSidebar()

const userInfo = {
  name: 'Shadcn',
  email: 'm@example.com',
  avatar: 'https://github.com/shadcn.png',
}

const emit = defineEmits(['tab-change'])

// Sur changement, appliquer la classe et sauvegarder
const data = {
  teams: [
    {
      name: 'Agence de ouenzé',
      logo: Command,
      plan: 'Enterprise',
    },
    {
      name: 'Agence de Bacongo',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navMain: [
    { id: 'home', title: 'Accueil', icon: Home, route: '/home' },
    { id: 'dashboard', title: 'Tableau de bord', icon: ChartArea, route: '/' },
    { id: 'vehicles', title: 'Véhicules Liste', icon: Car, route: '/vehicles' },
    { id: 'conducteurs', title: 'Conducteurs', icon: Users, route: '/conducteurs' },
    { id: 'documents', title: 'Documents', icon: File, route: '/documents' },
    { id: 'recettes', title: 'Recettes', icon: Coins, route: '/recettes' },
    { id: 'carburant', title: 'Carburant', icon: Fuel, route: '/carburant' },
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

      <!-- Menu dropdown de l'utilisateur -->
      <div class="mb-4 mt-1 mx-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage :src="userInfo.avatar" :alt="userInfo.name" />
                    <AvatarFallback class="rounded-lg">SC</AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ userInfo.name }}</span>
                    <span class="truncate text-xs text-muted-foreground">{{ userInfo.email }}</span>
                  </div>
                  <ChevronsUpDown class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                :side="isMobile ? 'bottom' : 'right'"
                align="end"
                :side-offset="4"
              >
                <DropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage :src="userInfo.avatar" :alt="userInfo.name" />
                      <AvatarFallback class="rounded-lg">SC</AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{ userInfo.name }}</span>
                      <span class="truncate text-xs text-muted-foreground">{{
                        userInfo.email
                      }}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User class="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard class="mr-2 h-4 w-4" />
                    Abonnement
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell class="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut class="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
