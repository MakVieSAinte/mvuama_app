<script setup lang="ts">
import {
  AudioWaveform,
  Calendar,
  Home,
  ChartArea,
  Car,
  CheckSquare,
  MapPin,
  File,
  Bell,
  History,
  Route,
  MessageCircleQuestion,
  Settings2,
  Trash2,
  Users,
  Coins,
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

import { ref, onMounted } from 'vue'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

// Import du service utilisateur
import { UserService } from '@/services/user/userService'

// Informations par défaut (en attendant de charger les vraies données)
const userInfo = ref({
  name: 'Chargement...',
  firstName: '',
  lastName: '',
  email: '',
  avatar: 'https://github.com/shadcn.png',
})

// État du modal de confirmation de déconnexion
const isLogoutDialogOpen = ref(false)

// Charger les informations de l'utilisateur au montage du composant
onMounted(async () => {
  try {
    // Récupérer les données formatées de l'utilisateur via le service
    const userData = await UserService.getUserDisplayInfo()

    if (userData) {
      // Mettre à jour les informations de l'utilisateur
      userInfo.value = {
        name: userData.name,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        avatar: userData.avatar || 'https://github.com/shadcn.png',
      }
      console.log('Informations utilisateur chargées:', userInfo.value)
    } else {
      console.log('Aucun utilisateur connecté trouvé')
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error)
  }
})

// Imports pour la gestion de l'authentification et de la navigation
import { AuthService } from '@/services/auth/auth'
import { useRouter } from 'vue-router'
const router = useRouter()

// Ouvrir le modal de confirmation
function openLogoutConfirmation() {
  isLogoutDialogOpen.value = true
}

// Fonction pour gérer la déconnexion après confirmation
async function handleLogout() {
  try {
    console.log('Tentative de déconnexion...')
    const success = await AuthService.signOut()

    if (success) {
      console.log('Déconnexion réussie')
      // Nettoyer le localStorage si nécessaire
      localStorage.removeItem('sb-user')
      localStorage.removeItem('sb-access-token')
      localStorage.removeItem('sb:session')

      // Fermer le modal
      isLogoutDialogOpen.value = false

      // Rediriger vers la page de connexion
      router.push('/auth/login')

      // Les notifications sont déjà gérées par la méthode signOut de AuthService
    } else {
      console.error('Échec de la déconnexion')
      // Les notifications d'erreur sont déjà gérées par la méthode signOut de AuthService
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    // Les erreurs sont déjà gérées par la méthode signOut de AuthService
  }
}

// Sur changement, appliquer la classe et sauvegarder
// Données de l'interface
const data = {
  // Des équipes de test (elles seront remplacées par des données dynamiques)
  teams: [
    {
      name: 'MVUAMA Agency',
      logo: AudioWaveform,
      plan: 'Licence Pro',
    },
  ],
  navMain: [
    { id: 'home', title: 'Accueil', icon: Home, route: '/home' },
    { id: 'dashboard', title: 'Tableau de bord', icon: ChartArea, route: '/' },
    { id: 'vehicles', title: 'Parc automobile', icon: Car, route: '/vehicles' },
    { id: 'conducteurs', title: 'Conducteurs', icon: Users, route: '/drivers' },
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
    {
      title: 'Configuration',
      url: '/configuration',
      icon: Settings2,
    },
    {
      title: 'Corbeille',
      url: '/trash',
      icon: Trash2,
    },
    {
      title: "Vous avez besoin d'aide ?",
      url: '/help',
      icon: MessageCircleQuestion,
    },
  ],
}
</script>

<template>
  <Sidebar class="border-r-0" v-bind="props">
    <SidebarHeader>
      <div class="flex items-center justify-between">
        <TeamSwitcher :teams="data.teams" class="w-full mt-2" />
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
                    <AvatarFallback class="rounded-lg">{{
                      userInfo.name ? userInfo.name.substring(0, 2).toUpperCase() : 'SC'
                    }}</AvatarFallback>
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
                      <AvatarFallback class="rounded-lg">{{
                        userInfo.name ? userInfo.name.substring(0, 2).toUpperCase() : 'SC'
                      }}</AvatarFallback>
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
                  <DropdownMenuItem asChild>
                    <router-link to="/profile" class="flex w-full items-center cursor-pointer">
                      <User class="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </router-link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <router-link to="/subscription" class="flex w-full items-center cursor-pointer">
                      <CreditCard class="mr-2 h-4 w-4" />
                      <span>Abonnement</span>
                    </router-link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <router-link
                      to="/notifications"
                      class="flex w-full items-center cursor-pointer"
                    >
                      <Bell class="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </router-link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  @click="openLogoutConfirmation"
                  class="group hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                >
                  <LogOut
                    class="mr-2 h-4 w-4 group-hover:text-red-600 transition-all duration-300"
                  />
                  <span class="group-hover:text-red-600 transition-all duration-300"
                    >Déconnexion</span
                  >
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </SidebarContent>
    <SidebarRail />
  </Sidebar>

  <!-- Modal de confirmation de déconnexion -->
  <Dialog v-model:open="isLogoutDialogOpen">
    <DialogContent class="sm:max-w-[355px]">
      <DialogHeader>
        <DialogTitle class="text-left text-xl">Confirmer la déconnexion</DialogTitle>
        <DialogDescription class="text-left">
          Êtes-vous sûr de vouloir vous déconnecter ?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="flex justify-end sm:justify-end mt-6">
        <Button variant="outline" @click="isLogoutDialogOpen = false"> Annuler </Button>
        <Button
          variant="destructive"
          @click="handleLogout"
          class="bg-red-600 hover:bg-red-700 text-white"
        >
          Déconnexion
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
