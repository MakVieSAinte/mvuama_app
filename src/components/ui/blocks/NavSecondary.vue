<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import type { Component } from 'vue'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

defineProps<{
  items: {
    title: string
    url: string
    icon: LucideIcon
    badge?: Component
  }[]
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in items" :key="item.title">
          <SidebarMenuButton as-child>
            <router-link :to="item.url">
              <component :is="item.icon" />
              <span>{{ item.title }}</span>
            </router-link>
          </SidebarMenuButton>
          <SidebarMenuBadge v-if="item.badge">
            <component :is="item.badge" />
          </SidebarMenuBadge>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
