<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSonner } from '@/plugins/sonner'
import { Bell, AlertTriangle, CheckCircle2, Info, Trash2, Check } from 'lucide-vue-next'

const { toastSuccess, toastError } = useSonner()

// Types pour les notifications
type NotificationType = 'info' | 'warning' | 'success' | 'error'
type NotificationFilter = 'all' | 'unread' | 'read'

interface Notification {
  id: number
  title: string
  message: string
  type: NotificationType
  read: boolean
  timestamp: Date
}

// Filtres pour les notifications
const currentFilter = ref<NotificationFilter>('all')

// Notifications
const notifications = ref<Notification[]>([
  {
    id: 1,
    title: 'Mise à jour du système',
    message:
      "Une nouvelle mise à jour est disponible. Veuillez redémarrer l'application pour appliquer les changements.",
    type: 'info',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
  },
  {
    id: 2,
    title: 'Maintenance prévue',
    message:
      'Une maintenance du système est prévue ce vendredi de 22h à 00h. Le service pourrait être momentanément indisponible.',
    type: 'warning',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
  {
    id: 3,
    title: 'Paiement réussi',
    message: "Votre paiement de 50€ pour l'abonnement mensuel a été traité avec succès.",
    type: 'success',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: 4,
    title: 'Erreur de synchronisation',
    message: 'La synchronisation des données a échoué. Veuillez vérifier votre connexion internet.',
    type: 'error',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: 5,
    title: 'Nouvelle fonctionnalité',
    message: 'Découvrez notre nouvelle fonctionnalité de rapports avancés dans le tableau de bord.',
    type: 'info',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
])

// Notifications filtrées
const filteredNotifications = computed(() => {
  if (currentFilter.value === 'all') return notifications.value
  if (currentFilter.value === 'unread') return notifications.value.filter((n) => !n.read)
  return notifications.value.filter((n) => n.read)
})

// Compteurs
const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)
const totalCount = computed(() => notifications.value.length)

// Marquer une notification comme lue
const markAsRead = (id: number) => {
  const notification = notifications.value.find((n) => n.id === id)
  if (notification) {
    notification.read = true
    toastSuccess('Notification marquée comme lue')
  }
}

// Marquer toutes les notifications comme lues
const markAllAsRead = () => {
  if (unreadCount.value === 0) return

  notifications.value.forEach((n) => {
    n.read = true
  })

  toastSuccess('Toutes les notifications ont été marquées comme lues')
}

// Supprimer une notification
const deleteNotification = (id: number) => {
  notifications.value = notifications.value.filter((n) => n.id !== id)
  toastSuccess('Notification supprimée')
}

// Supprimer toutes les notifications
const clearAllNotifications = () => {
  if (notifications.value.length === 0) return

  notifications.value = []
  toastSuccess('Toutes les notifications ont été supprimées')
}

// Format relatif pour les dates
const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Il y a quelques secondes'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  } else {
    return date.toLocaleDateString('fr-FR')
  }
}

// Icône en fonction du type de notification
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'info':
      return Info
    case 'warning':
      return AlertTriangle
    case 'success':
      return CheckCircle2
    case 'error':
      return AlertTriangle
    default:
      return Bell
  }
}

// Classes en fonction du type de notification
const getNotificationClasses = (type: NotificationType) => {
  switch (type) {
    case 'info':
      return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20'
    case 'warning':
      return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/20'
    case 'success':
      return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
    case 'error':
      return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
    default:
      return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20'
  }
}
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Centre de Notifications</CardTitle>
        <CardDescription> Consultez et gérez vos notifications </CardDescription>
      </div>

      <div class="flex items-center space-x-2">
        <Button variant="outline" size="sm" @click="markAllAsRead" :disabled="unreadCount === 0">
          Tout marquer comme lu
        </Button>
        <Button
          variant="ghost"
          size="sm"
          @click="clearAllNotifications"
          :disabled="notifications.length === 0"
        >
          Effacer tout
        </Button>
      </div>
    </CardHeader>

    <CardContent>
      <!-- Filtres -->
      <div class="flex items-center space-x-2 mb-6">
        <Button
          @click="currentFilter = 'all'"
          :variant="currentFilter === 'all' ? 'default' : 'outline'"
          size="sm"
          class="relative"
        >
          Toutes
          <Badge v-if="totalCount > 0" class="ml-2 h-5 px-1.5">{{ totalCount }}</Badge>
        </Button>

        <Button
          @click="currentFilter = 'unread'"
          :variant="currentFilter === 'unread' ? 'default' : 'outline'"
          size="sm"
          class="relative"
        >
          Non lues
          <Badge v-if="unreadCount > 0" class="ml-2 h-5 px-1.5">{{ unreadCount }}</Badge>
        </Button>

        <Button
          @click="currentFilter = 'read'"
          :variant="currentFilter === 'read' ? 'default' : 'outline'"
          size="sm"
        >
          Lues
        </Button>
      </div>

      <!-- Liste des notifications -->
      <div class="space-y-3">
        <div v-if="filteredNotifications.length === 0" class="text-center py-8">
          <Bell class="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <p class="mt-2 text-muted-foreground">
            {{
              currentFilter === 'all'
                ? 'Aucune notification'
                : currentFilter === 'unread'
                  ? 'Aucune notification non lue'
                  : 'Aucune notification lue'
            }}
          </p>
        </div>

        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          class="p-4 rounded-lg transition-all duration-200"
          :class="!notification.read ? 'bg-muted/50 dark:bg-muted/10' : ''"
        >
          <div class="flex gap-3">
            <!-- Icône -->
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              :class="getNotificationClasses(notification.type)"
            >
              <component :is="getNotificationIcon(notification.type)" class="h-4 w-4" />
            </div>

            <!-- Contenu -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <h4 class="text-sm font-medium">{{ notification.title }}</h4>
                <span class="text-xs text-muted-foreground whitespace-nowrap">
                  {{ formatRelativeTime(notification.timestamp) }}
                </span>
              </div>

              <p class="text-sm text-muted-foreground mt-1 mb-2">
                {{ notification.message }}
              </p>

              <div class="flex items-center gap-2 mt-2">
                <Button
                  v-if="!notification.read"
                  size="sm"
                  variant="outline"
                  class="h-7 text-xs"
                  @click="markAsRead(notification.id)"
                >
                  <Check class="mr-1 h-3 w-3" />
                  Marquer comme lu
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  class="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  @click="deleteNotification(notification.id)"
                >
                  <Trash2 class="mr-1 h-3 w-3" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>

    <CardFooter
      v-if="filteredNotifications.length > 0"
      class="flex justify-center text-xs text-muted-foreground"
    >
      Affichage de {{ filteredNotifications.length }} notification{{
        filteredNotifications.length > 1 ? 's' : ''
      }}
    </CardFooter>
  </Card>
</template>
