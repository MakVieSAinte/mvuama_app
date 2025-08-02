<script setup lang="ts">
import {
  ArrowDown,
  ArrowUp,
  Bell,
  User,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  GalleryVerticalEnd,
  LineChart,
  Link,
  MoreHorizontal,
  Settings2,
  Star,
  Trash,
  Trash2,
} from 'lucide-vue-next'

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
      label: 'Copier le lien',
      icon: Link,
    },
    {
      label: 'Configuration',
      icon: Settings2,
    },
    {
      label: 'Profil',
      icon: User,
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
</script>

<template>
  <div class="flex items-center gap-2 text-sm">
    <div class="hidden font-medium text-muted-foreground md:inline-block">Edit Oct 08</div>
    <Button variant="ghost" size="icon" class="h-7 w-7">
      <Star />
    </Button>
    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <Button variant="ghost" size="icon" class="h-7 w-7 data-[state=open]:bg-accent">
          <MoreHorizontal />
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
                    <SidebarMenuButton>
                      <component :is="item.icon" /> <span>{{ item.label }}</span>
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
