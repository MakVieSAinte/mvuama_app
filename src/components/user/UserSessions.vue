<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSonner } from '@/plugins/sonner'

const { toastSuccess, toastError } = useSonner()

// Sessions simulées
const sessions = ref([
  {
    id: 1,
    device: 'Chrome sur Windows',
    location: 'Paris, France',
    ip: '192.168.1.1',
    lastActive: new Date('2023-05-15T14:30:00'),
    current: true,
  },
  {
    id: 2,
    device: 'Firefox sur Android',
    location: 'Lyon, France',
    ip: '192.168.1.2',
    lastActive: new Date('2023-05-14T10:20:00'),
    current: false,
  },
  {
    id: 3,
    device: 'Safari sur MacOS',
    location: 'Marseille, France',
    ip: '192.168.1.3',
    lastActive: new Date('2023-05-10T08:45:00'),
    current: false,
  },
])

// Formatage de la date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)
}

// Déconnexion d'une session
const disconnectSession = async (sessionId: number) => {
  try {
    // Simulation de déconnexion
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Filtrer la session déconnectée
    sessions.value = sessions.value.filter((s) => s.id !== sessionId)

    toastSuccess('Session déconnectée avec succès')
  } catch (error) {
    console.error('Erreur lors de la déconnexion de la session:', error)
    toastError('Impossible de déconnecter la session')
  }
}

// Déconnecter toutes les autres sessions
const disconnectAllOtherSessions = async () => {
  try {
    // Simulation de déconnexion multiple
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Ne garder que la session courante
    sessions.value = sessions.value.filter((s) => s.current)

    toastSuccess('Toutes les autres sessions ont été déconnectées')
  } catch (error) {
    console.error('Erreur lors de la déconnexion des sessions:', error)
    toastError('Impossible de déconnecter les sessions')
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Sessions Actives</CardTitle>
      <CardDescription
        >Gérez vos sessions de connexion actuelles sur différents appareils</CardDescription
      >
    </CardHeader>
    <CardContent class="space-y-6">
      <div v-if="sessions.length === 0" class="text-center py-8">
        <p class="text-muted-foreground">Aucune session active</p>
      </div>

      <div v-else>
        <div
          v-for="session in sessions"
          :key="session.id"
          class="flex items-start justify-between border-b py-4 last:border-0"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-base font-medium">{{ session.device }}</span>
              <span
                v-if="session.current"
                class="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
              >
                Session courante
              </span>
            </div>
            <p class="text-sm text-muted-foreground">{{ session.location }} • {{ session.ip }}</p>
            <p class="text-xs text-muted-foreground">
              Dernière activité: {{ formatDate(session.lastActive) }}
            </p>
          </div>
          <Button
            v-if="!session.current"
            variant="outline"
            size="sm"
            @click="disconnectSession(session.id)"
          >
            Déconnecter
          </Button>
        </div>
      </div>

      <div v-if="sessions.length > 1" class="pt-4">
        <Button variant="outline" class="w-full" @click="disconnectAllOtherSessions">
          Déconnecter toutes les autres sessions
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
