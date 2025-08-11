<template>
  <div class="space-y-6 p-4 md:p-4 lg:p-5">
    <!-- Alertes importantes -->
    <DashboardAlerts
      :expired-documents="expiredDocuments"
      :near-expiry-documents="nearExpiryDocuments"
      :vehicles-in-maintenance="vehiclesInMaintenance"
    />

    <!-- KPI Cards -->
    <DashboardKpiCards
      :vehicle-stats="vehicleStats"
      :monthly-revenue="monthlyRevenue"
      :monthly-expenses="monthlyExpenses"
      :revenue-growth="revenueGrowth"
      :balance="balance"
    />

    <!-- Statut des véhicules et répartition par type -->
    <DashboardVehicleStatus :vehicle-stats="vehicleStats" :vehicle-type-stats="vehicleTypeStats" />

    <!-- Performance financière du mois -->
    <DashboardFinancialPerformance
      :monthly-revenue="monthlyRevenue"
      :monthly-expenses="monthlyExpenses"
      :balance="balance"
      :revenue-progress="revenueProgress"
      :expense-progress="expenseProgress"
    />

    <!-- Documents bientôt expirés -->
    <DashboardDocuments :documents-to-expire="documentsToExpire" />

    <!-- Tendance d'utilisation des véhicules -->
    <DashboardUsageTrend
      :usage-trend="usageTrend"
      :months="mockData.usageTrends.months"
      :km-data="mockData.usageTrends.kmData"
    />

    <!-- Répartition des dépenses -->
    <DashboardExpenseBreakdown :expense-breakdown="expenseBreakdown" />

    <!-- Top 5 véhicules et chauffeurs -->
    <DashboardTopPerformers :top-vehicles="topVehicles" :top-drivers="topDrivers" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DashboardAlerts from '@/components/dashboard/base/DashboardAlerts.vue'
import DashboardKpiCards from '@/components/dashboard/base/DashboardKpiCards.vue'
import DashboardVehicleStatus from '@/components/dashboard/base/DashboardVehicleStatus.vue'
import DashboardFinancialPerformance from '@/components/dashboard/base/DashboardFinancialPerformance.vue'
import DashboardDocuments from '@/components/dashboard/base/DashboardDocuments.vue'
import DashboardUsageTrend from '@/components/dashboard/base/DashboardUsageTrend.vue'
import DashboardExpenseBreakdown from '@/components/dashboard/base/DashboardExpenseBreakdown.vue'
import DashboardTopPerformers from '@/components/dashboard/base/DashboardTopPerformers.vue'

export default defineComponent({
  name: 'DashboardComponent',
  components: {
    DashboardAlerts,
    DashboardKpiCards,
    DashboardVehicleStatus,
    DashboardFinancialPerformance,
    DashboardDocuments,
    DashboardUsageTrend,
    DashboardExpenseBreakdown,
    DashboardTopPerformers,
  },
  data() {
    return {
      mockData: {
        vehicles: {
          total: 15,
          actifs: 12,
          enPanne: 1,
          enRevision: 2,
          vendus: 0,
        },
        finances: {
          monthlyRevenue: 45000,
          monthlyExpenses: 32000,
          revenueGrowth: 12.5,
          targetRevenue: 50000,
        },
        types: {
          voiture: 8,
          utilitaire: 4,
          camion: 3,
        },
        documents: [
          {
            id: 1,
            vehicleInfo: 'AB-123-CD',
            type: 'Assurance',
            dateExpiration: '2025-02-15',
            isExpired: false,
            daysUntilExpiry: 14,
          },
          {
            id: 2,
            vehicleInfo: 'EF-456-GH',
            type: 'Contrôle technique',
            dateExpiration: '2025-01-20',
            isExpired: true,
            daysUntilExpiry: -13,
          },
          {
            id: 3,
            vehicleInfo: 'IJ-789-KL',
            type: 'Vignette',
            dateExpiration: '2025-02-28',
            isExpired: false,
            daysUntilExpiry: 27,
          },
        ],
        usageTrends: {
          currentMonth: 12500,
          previousMonth: 11200,
          months: ['Oct', 'Nov', 'Déc', 'Jan', 'Fév'],
          kmData: [9800, 10200, 11200, 11800, 12500],
        },
        expenseBreakdown: {
          entretien: 12000,
          carburant: 8500,
          assurance: 6000,
          reparations: 3500,
          autres: 2000,
        },
        topVehicles: [
          {
            id: 1,
            immatriculation: 'AB-123-CD',
            type: 'Voiture',
            recettes: 3500,
            depenses: 1200,
            profit: 2300,
          },
          {
            id: 2,
            immatriculation: 'EF-456-GH',
            type: 'Utilitaire',
            recettes: 4200,
            depenses: 1800,
            profit: 2400,
          },
          {
            id: 3,
            immatriculation: 'IJ-789-KL',
            type: 'Camion',
            recettes: 5500,
            depenses: 2200,
            profit: 3300,
          },
          {
            id: 4,
            immatriculation: 'MN-012-OP',
            type: 'Voiture',
            recettes: 2800,
            depenses: 1100,
            profit: 1700,
          },
          {
            id: 5,
            immatriculation: 'QR-345-ST',
            type: 'Utilitaire',
            recettes: 3800,
            depenses: 1600,
            profit: 2200,
          },
        ],
        topDrivers: [
          { id: 1, nom: 'Ahmed Ben Ali', recettes: 8500, kmParcourus: 3200, vehicule: 'AB-123-CD' },
          { id: 2, nom: 'Fatima Zahra', recettes: 7800, kmParcourus: 2950, vehicule: 'EF-456-GH' },
          {
            id: 3,
            nom: 'Mohamed Tounsi',
            recettes: 9200,
            kmParcourus: 3100,
            vehicule: 'IJ-789-KL',
          },
          {
            id: 4,
            nom: 'Aisha Mansouri',
            recettes: 6900,
            kmParcourus: 2800,
            vehicule: 'MN-012-OP',
          },
          {
            id: 5,
            nom: 'Youssef Khalil',
            recettes: 7200,
            kmParcourus: 2750,
            vehicule: 'QR-345-ST',
          },
        ],
      },
    }
  },
  computed: {
    vehicleStats() {
      return this.mockData.vehicles
    },
    monthlyRevenue() {
      return this.mockData.finances.monthlyRevenue
    },
    monthlyExpenses() {
      return this.mockData.finances.monthlyExpenses
    },
    revenueGrowth() {
      return this.mockData.finances.revenueGrowth
    },
    balance() {
      return this.monthlyRevenue - this.monthlyExpenses
    },
    vehicleTypeStats() {
      return this.mockData.types
    },
    documentsToExpire() {
      return this.mockData.documents
    },
    expiredDocuments() {
      return this.documentsToExpire.filter((doc) => doc.isExpired)
    },
    nearExpiryDocuments() {
      return this.documentsToExpire.filter((doc) => !doc.isExpired && doc.daysUntilExpiry <= 30)
    },
    vehiclesInMaintenance() {
      return this.vehicleStats.enPanne + this.vehicleStats.enRevision
    },
    hasAlerts() {
      return (
        this.expiredDocuments.length > 0 ||
        this.nearExpiryDocuments.length > 0 ||
        this.vehiclesInMaintenance > 0
      )
    },
    revenueProgress() {
      return Math.min((this.monthlyRevenue / this.mockData.finances.targetRevenue) * 100, 100)
    },
    expenseProgress() {
      return Math.min((this.monthlyExpenses / this.monthlyRevenue) * 100, 100)
    },
    usageTrend() {
      const current = this.mockData.usageTrends.currentMonth
      const previous = this.mockData.usageTrends.previousMonth
      const growth = ((current - previous) / previous) * 100
      return { current, previous, growth: Math.round(growth * 10) / 10 }
    },
    expenseBreakdown() {
      return this.mockData.expenseBreakdown
    },
    topVehicles() {
      return [...this.mockData.topVehicles].sort((a, b) => b.profit - a.profit)
    },
    topDrivers() {
      return [...this.mockData.topDrivers].sort((a, b) => b.recettes - a.recettes)
    },
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount)
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('fr-FR')
    },
  },
})
</script>
