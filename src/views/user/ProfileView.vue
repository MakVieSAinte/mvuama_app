<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserProfileInfo from '@/components/user/UserProfileInfo.vue'
import UserPreferences from '@/components/user/UserPreferences.vue'
import UserSecurity from '@/components/user/UserSecurity.vue'
import UserSessions from '@/components/user/UserSessions.vue'
import '@/assets/css/custom-tabs.css'

const activeTab = ref('profile-info')
</script>

<template>
  <div class="space-y-8 min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-8">
    <!-- Header avec titre -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold tracking-tight">Profil Utilisateur</h1>
    </div>

    <!-- Onglets -->
    <Tabs v-model="activeTab" class="w-full mb-6 custom-tabs">
      <TabsList class="grid grid-cols-4 w-full md:w-[500px]">
        <TabsTrigger value="profile-info" class="tab-trigger"> Informations </TabsTrigger>
        <TabsTrigger value="preferences" class="tab-trigger"> Préférences </TabsTrigger>
        <TabsTrigger value="security" class="tab-trigger"> Sécurité </TabsTrigger>
        <TabsTrigger value="sessions" class="tab-trigger"> Sessions </TabsTrigger>
      </TabsList>

      <TabsContent value="profile-info" class="mt-6">
        <UserProfileInfo />
      </TabsContent>

      <TabsContent value="preferences" class="mt-6">
        <UserPreferences />
      </TabsContent>

      <TabsContent value="security" class="mt-6">
        <UserSecurity />
      </TabsContent>

      <TabsContent value="sessions" class="mt-6">
        <UserSessions />
      </TabsContent>
    </Tabs>
  </div>
</template>
