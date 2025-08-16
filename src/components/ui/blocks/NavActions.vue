<script setup lang="ts">
import {
  ArrowDown,
  ArrowUp,
  Bell,
  User,
  GalleryVerticalEnd,
  LineChart,
  MoreHorizontal,
  Settings2,
  Trash,
  AlertTriangle,
  Sun,
  Moon,
} from 'lucide-vue-next'
import { useUserPrefs } from '@/composables/useUserPrefs'

import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = [
  [
    {
      label: 'Profil',
      icon: User,
    },
    {
      label: 'Configuration',
      icon: Settings2,
    },
    {
      label: 'Changer de thème',
      icon: null,
      action: 'toggleTheme',
    },
  ],
  [
    {
      label: 'Voir les statistiques',
      icon: LineChart,
    },
    {
      label: 'Historique des recettes',
      icon: GalleryVerticalEnd,
    },
    {
      label: 'Afficher les éléments supprimés',
      icon: Trash,
    },
    {
      label: 'Notifications',
      icon: Bell,
    },
  ],
  [
    {
      label: 'Import',
      icon: ArrowUp,
    },
    {
      label: 'Export',
      icon: ArrowDown,
    },
  ],
]

const isOpen = ref(false)
const { theme, toggleTheme } = useUserPrefs('user_prefs_mvuama')
</script>

<template>
  <div class="flex items-center gap-3 text-sm">
    <!-- Suppression du switch de thème du header -->
    <!-- Triangle rouge pour alertes -->
    <Button variant="ghost" size="icon" class="flex items-center gap-2 h-7 w-auto px-2">
      <AlertTriangle class="text-red-500" />
      <span class="text-sm text-muted-foreground font-semibold">2</span>
    </Button>
    <!-- Triangle orange pour warnings -->
    <Button variant="ghost" size="icon" class="flex items-center gap-2 h-7 w-auto px-2">
      <AlertTriangle class="text-orange-400" />
      <span class="text-sm text-muted-foreground font-semibold">1</span>
    </Button>
    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <Button variant="ghost" size="icon" class="h-7 w-7 data-[state=open]:bg-accent">
          <MoreHorizontal class="text-gray-700 dark:text-gray-100" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-56 overflow-hidden rounded-lg p-0" align="end">
        <Sidebar collapsible="none" class="bg-transparent">
          <SidebarContent>
            <SidebarGroup
              v-for="(group, index) in data"
              :key="index"
              class="border-b last:border-none"
            >
              <SidebarGroupContent class="gap-0">
                <SidebarMenu>
                  <SidebarMenuItem v-for="(item, index) in group" :key="index">
                    <SidebarMenuButton
                      @click="item.action === 'toggleTheme' ? toggleTheme() : undefined"
                    >
                      <template v-if="item.action === 'toggleTheme'">
                        <component :is="theme === 'dark' ? Sun : Moon" class="mr-2" />
                      </template>
                      <template v-else>
                        <component :is="item.icon" class="mr-2" />
                      </template>
                      <span>{{ item.label }}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </PopoverContent>
    </Popover>
  </div>
</template>
