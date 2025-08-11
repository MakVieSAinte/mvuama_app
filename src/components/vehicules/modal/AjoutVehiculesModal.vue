<template>
  <Dialog :open="open" @update:open="$emit('close')">
    <DialogContent
      class="!fixed !m-0 !max-w-none !w-[85%] !h-[90%] !rounded-none !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 p-0 overflow-hidden flex flex-col"
    >
      <DialogHeader class="p-6 border-b">
        <DialogTitle class="text-2xl">Ajouter un nouveau véhicule</DialogTitle>
        <DialogDescription>
          Veuillez remplir les informations du véhicule. Les champs marqués d'un * sont
          obligatoires.
        </DialogDescription>
      </DialogHeader>

      <!-- Contenu principal avec défilement -->
      <div class="flex-1 overflow-y-auto p-6">
        <Accordion
          type="multiple"
          :defaultValue="['essentiel', 'technique', 'reglementaire', 'localisation', 'financier']"
          class="space-y-4"
        >
          <!-- 1️⃣ Informations essentielles -->
          <AccordionItem value="essentiel">
            <AccordionTrigger class="bg-muted/50 px-4 hover:bg-muted/80 rounded-t-lg">
              <div class="flex items-center gap-2">
                <Info class="h-5 w-5" />
                <span>Informations essentielles</span>
              </div>
            </AccordionTrigger>
            <AccordionContent class="pt-6 px-4 pb-4">
              <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                <!-- ... contenu de la section Informations essentielles ... -->
                <div class="col-span-full">
                  <div class="flex items-center justify-center mb-4">
                    <div
                      class="relative h-40 w-40 rounded-md border border-dashed border-muted-foreground flex items-center justify-center overflow-hidden"
                      :class="{ 'bg-muted': !vehiclePhoto }"
                    >
                      <img
                        v-if="vehiclePhoto"
                        :src="vehiclePhoto"
                        alt="Aperçu du véhicule"
                        class="h-full w-full object-cover"
                      />
                      <div v-else class="text-center p-2">
                        <ImageIcon class="h-10 w-10 mx-auto text-muted-foreground" />
                        <p class="text-sm text-muted-foreground mt-2">Photo du véhicule</p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        class="absolute bottom-2 right-2 h-8 w-8 rounded-full"
                        @click="uploadPhoto"
                      >
                        <Upload v-if="!vehiclePhoto" class="h-4 w-4" />
                        <Pencil v-else class="h-4 w-4" />
                      </Button>
                      <input
                        ref="photoInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="onPhotoSelected"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label for="marque">Marque *</Label>
                  <Select v-model="form.marque">
                    <SelectTrigger id="marque" class="w-full">
                      <SelectValue placeholder="Sélectionner une marque" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="marque in marques" :key="marque" :value="marque">
                        {{ marque }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label for="modele">Modèle *</Label>
                  <Input id="modele" v-model="form.modele" placeholder="Modèle du véhicule" />
                </div>
                <div>
                  <Label for="annee">Année de fabrication *</Label>
                  <Select v-model="form.annee">
                    <SelectTrigger id="annee" class="w-full">
                      <SelectValue placeholder="Sélectionner une année" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="annee in annees" :key="annee" :value="annee">
                        {{ annee }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label for="immatriculation">Numéro d'immatriculation *</Label>
                  <Input
                    id="immatriculation"
                    v-model="form.immatriculation"
                    placeholder="AA-123-BB"
                    class="uppercase"
                  />
                </div>
                <div>
                  <Label for="type">Type de véhicule *</Label>
                  <Select v-model="form.type">
                    <SelectTrigger id="type" class="w-full">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="voiture">Voiture</SelectItem>
                      <SelectItem value="utilitaire">Utilitaire</SelectItem>
                      <SelectItem value="camion">Camion</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="moto">Moto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label for="statut">Statut *</Label>
                  <Select v-model="form.statut">
                    <SelectTrigger id="statut" class="w-full">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="maintenance">En maintenance</SelectItem>
                      <SelectItem value="panne">En panne</SelectItem>
                      <SelectItem value="reserve">En réserve</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label for="couleur">Couleur</Label>
                  <div class="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          class="w-[40px] h-[40px] p-0 border-2"
                          :style="{ backgroundColor: form.couleur }"
                        >
                          <span class="sr-only">Pick a color</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="w-64">
                        <div class="grid gap-2">
                          <div class="grid grid-cols-6 gap-2">
                            <Button
                              v-for="color in colorOptions"
                              :key="color"
                              variant="outline"
                              class="w-8 h-8 p-0 border-2"
                              :style="{ backgroundColor: color }"
                              :class="{ 'ring-2 ring-primary': form.couleur === color }"
                              @click="form.couleur = color"
                            >
                              <span class="sr-only">{{ color }}</span>
                            </Button>
                          </div>
                          <Input
                            v-model="form.couleur"
                            placeholder="#000000"
                            class="col-span-2 h-8"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Input id="couleur" v-model="form.couleur" placeholder="#000000" />
                  </div>
                </div>
                <div>
                  <Label for="vin">Numéro de série (VIN)</Label>
                  <Input id="vin" v-model="form.vin" placeholder="Numéro de série du véhicule" />
                </div>
                <div>
                  <Label for="service">Affectation / Service</Label>
                  <Select v-model="form.service">
                    <SelectTrigger id="service" class="w-full">
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direction">Direction</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="logistique">Logistique</SelectItem>
                      <SelectItem value="technique">Technique</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label for="chauffeur">Conducteur attitré</Label>
                  <Select v-model="form.chauffeur">
                    <SelectTrigger id="chauffeur" class="w-full">
                      <SelectValue placeholder="Sélectionner un conducteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="chauffeur in chauffeurs"
                        :key="chauffeur.id"
                        :value="chauffeur.id"
                      >
                        {{ chauffeur.nom }}
                      </SelectItem>
                      <SelectItem value="aucun">Aucun conducteur attitré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- 2️⃣ Caractéristiques techniques -->
          <AccordionItem value="technique">
            <AccordionTrigger class="bg-muted/50 px-4 hover:bg-muted/80 rounded-t-lg">
              <div class="flex items-center gap-2">
                <Settings class="h-5 w-5" />
                <span>Caractéristiques techniques</span>
              </div>
            </AccordionTrigger>
            <AccordionContent class="pt-6 px-4 pb-4">
              <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                <!-- ... contenu de la section Caractéristiques techniques ... -->
                <div>
                  <Label for="carburant">Carburant *</Label>
                  <Select v-model="form.carburant">
                    <SelectTrigger id="carburant" class="w-full">
                      <SelectValue placeholder="Sélectionner un type de carburant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essence">Essence</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hybride">Hybride</SelectItem>
                      <SelectItem value="electrique">Électrique</SelectItem>
                      <SelectItem value="gpl">GPL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label for="kilometrage">Kilométrage initial</Label>
                  <div class="flex">
                    <Input
                      id="kilometrage"
                      v-model="form.kilometrage"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      class="rounded-r-none"
                    />
                    <div
                      class="inline-flex items-center justify-center rounded-r-md border border-l-0 border-input bg-muted px-3"
                    >
                      <span class="text-sm text-muted-foreground">km</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label for="dateMiseEnService">Date de mise en service</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal"
                        :class="{ 'text-muted-foreground': !form.dateMiseEnService }"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{
                          form.dateMiseEnService
                            ? formatDate(form.dateMiseEnService)
                            : 'Sélectionner une date'
                        }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar
                        v-model="form.dateMiseEnService"
                        :disabled-dates="{ after: new Date() }"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label for="capacitePassagers">Capacité passagers</Label>
                  <Input
                    id="capacitePassagers"
                    v-model="form.capacitePassagers"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label for="chargeUtile">Charge utile (kg)</Label>
                  <div class="flex">
                    <Input
                      id="chargeUtile"
                      v-model="form.chargeUtile"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      class="rounded-r-none"
                    />
                    <div
                      class="inline-flex items-center justify-center rounded-r-md border border-l-0 border-input bg-muted px-3"
                    >
                      <span class="text-sm text-muted-foreground">kg</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label for="etat">État du véhicule</Label>
                  <Select v-model="form.etat">
                    <SelectTrigger id="etat" class="w-full">
                      <SelectValue placeholder="Sélectionner un état" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neuf">Neuf</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="bon">Bon</SelectItem>
                      <SelectItem value="moyen">Moyen</SelectItem>
                      <SelectItem value="mauvais">Mauvais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="md:col-span-2">
                  <Label for="description">Libellé / Description</Label>
                  <Textarea
                    id="description"
                    v-model="form.description"
                    placeholder="Description du véhicule"
                    rows="3"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- 3️⃣ Suivi technique & réglementaire -->
          <AccordionItem value="reglementaire">
            <AccordionTrigger class="bg-muted/50 px-4 hover:bg-muted/80 rounded-t-lg">
              <div class="flex items-center gap-2">
                <ClipboardCheck class="h-5 w-5" />
                <span>Suivi technique & réglementaire</span>
              </div>
            </AccordionTrigger>
            <AccordionContent class="pt-6 px-4 pb-4">
              <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                <!-- ... contenu de la section Suivi technique & réglementaire ... -->
                <div>
                  <Label for="controle">Prochain contrôle technique</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal"
                        :class="{ 'text-muted-foreground': !form.controle }"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{ form.controle ? formatDate(form.controle) : 'Sélectionner une date' }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar v-model="form.controle" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label for="maintenance">Prochaine maintenance prévue</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal"
                        :class="{ 'text-muted-foreground': !form.maintenance }"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{
                          form.maintenance ? formatDate(form.maintenance) : 'Sélectionner une date'
                        }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar v-model="form.maintenance" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label for="assuranceCompagnie">Assurance : Compagnie</Label>
                  <Input
                    id="assuranceCompagnie"
                    v-model="form.assuranceCompagnie"
                    placeholder="Nom de la compagnie d'assurance"
                  />
                </div>
                <div>
                  <Label for="assuranceContrat">N° de contrat</Label>
                  <Input
                    id="assuranceContrat"
                    v-model="form.assuranceContrat"
                    placeholder="Numéro de contrat d'assurance"
                  />
                </div>
                <div>
                  <Label for="assuranceExpiration">Date d'expiration assurance</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal"
                        :class="{ 'text-muted-foreground': !form.assuranceExpiration }"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{
                          form.assuranceExpiration
                            ? formatDate(form.assuranceExpiration)
                            : 'Sélectionner une date'
                        }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar v-model="form.assuranceExpiration" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- 4️⃣ Localisation & suivi -->
          <AccordionItem value="localisation">
            <AccordionTrigger class="bg-muted/50 px-4 hover:bg-muted/80 rounded-t-lg">
              <div class="flex items-center gap-2">
                <MapPin class="h-5 w-5" />
                <span>Localisation & suivi</span>
              </div>
            </AccordionTrigger>
            <AccordionContent class="pt-6 px-4 pb-4">
              <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                <!-- ... contenu de la section Localisation & suivi ... -->
                <div>
                  <div class="flex items-center gap-2">
                    <Checkbox id="hasGPS" v-model="form.hasGPS" />
                    <Label for="hasGPS" class="text-sm font-medium">Équipé d'un GPS</Label>
                  </div>
                </div>
                <div>
                  <Label for="zone">Zone habituelle d'utilisation</Label>
                  <Select v-model="form.zone">
                    <SelectTrigger id="zone" class="w-full">
                      <SelectValue placeholder="Sélectionner une zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urbain">Zone urbaine</SelectItem>
                      <SelectItem value="rural">Zone rurale</SelectItem>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                      <SelectItem value="chantier">Chantier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- 5️⃣ Gestion financière & planning -->
          <AccordionItem value="financier">
            <AccordionTrigger class="bg-muted/50 px-4 hover:bg-muted/80 rounded-t-lg">
              <div class="flex items-center gap-2">
                <DollarSign class="h-5 w-5" />
                <span>Gestion financière & planning</span>
              </div>
            </AccordionTrigger>
            <AccordionContent class="pt-6 px-4 pb-4">
              <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                <!-- ... contenu de la section Gestion financière & planning ... -->
                <div>
                  <Label for="montant">Montant journalier à verser</Label>
                  <div class="flex">
                    <Input
                      id="montant"
                      v-model="form.montant"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      class="rounded-r-none"
                    />
                    <div
                      class="inline-flex items-center justify-center rounded-r-md border border-l-0 border-input bg-muted px-3"
                    >
                      <span class="text-sm text-muted-foreground">€</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label for="joursSortie">Jours de sortie</Label>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <div v-for="(jour, index) in jours" :key="jour" class="flex items-center">
                      <Checkbox
                        :id="'jour-' + index"
                        v-model="form.joursSortie[index]"
                        class="mr-2"
                      />
                      <Label :for="'jour-' + index" class="text-sm">{{ jour }}</Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label for="heureSortie">Heure de sortie</Label>
                  <Select v-model="form.heureSortie">
                    <SelectTrigger id="heureSortie" class="w-full">
                      <SelectValue placeholder="Sélectionner une heure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Heures</SelectLabel>
                        <SelectItem v-for="heure in heures" :key="heure" :value="heure">
                          {{ heure }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label for="heureEntree">Heure d'entrée maximum</Label>
                  <Select v-model="form.heureEntree">
                    <SelectTrigger id="heureEntree" class="w-full">
                      <SelectValue placeholder="Sélectionner une heure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Heures</SelectLabel>
                        <SelectItem v-for="heure in heures" :key="heure" :value="heure">
                          {{ heure }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <!-- Boutons d'action fixes en bas -->
      <div
        class="p-4 border-t bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 sticky bottom-0 flex justify-end gap-4"
      >
        <Button variant="outline" @click="$emit('close')">Annuler</Button>
        <Button @click="submitForm" type="submit">Enregistrer</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Import des composants shadcn-vue
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

// Import des icônes
import {
  CalendarIcon,
  Info,
  Settings,
  ClipboardCheck,
  MapPin,
  DollarSign,
  ImageIcon,
  Upload,
  Pencil,
} from 'lucide-vue-next'

export default defineComponent({
  name: 'AjoutVehiculesModal',
  components: {
    // Composants shadcn
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    Input,
    Label,
    Button,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    Calendar,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Textarea,
    Checkbox,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,

    // Icônes
    CalendarIcon,
    Info,
    Settings,
    ClipboardCheck,
    MapPin,
    DollarSign,
    ImageIcon,
    Upload,
    Pencil,
  },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],

  setup(props, { emit }) {
    // Référence pour l'input de fichier d'image
    const photoInput = ref<HTMLInputElement | null>(null)
    const vehiclePhoto = ref<string | null>(null)

    // Données pour les listes déroulantes
    const marques = [
      'Toyota',
      'Peugeot',
      'Renault',
      'Mercedes',
      'BMW',
      'Ford',
      'Volkswagen',
      'Audi',
      'Citroën',
      'Fiat',
    ]

    const annees = Array.from({ length: 21 }, (_, i) =>
      (new Date().getFullYear() - 20 + i).toString(),
    )

    const chauffeurs = [
      { id: 1, nom: 'Ahmed Ben Ali' },
      { id: 2, nom: 'Fatima Zahra' },
      { id: 3, nom: 'Mohamed Tounsi' },
      { id: 4, nom: 'Aisha Mansouri' },
      { id: 5, nom: 'Youssef Khalil' },
    ]

    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

    const heures = Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0')
      return `${hour}:00`
    })

    const colorOptions = [
      '#000000', // Noir
      '#FFFFFF', // Blanc
      '#FF0000', // Rouge
      '#0000FF', // Bleu
      '#FFFF00', // Jaune
      '#00FF00', // Vert
      '#FFA500', // Orange
      '#808080', // Gris
      '#A52A2A', // Marron
      '#800080', // Violet
      '#FFC0CB', // Rose
      '#008080', // Turquoise
    ]

    // Formulaire
    const form = reactive({
      marque: '',
      modele: '',
      annee: new Date().getFullYear().toString(),
      immatriculation: '',
      type: '',
      statut: 'actif',
      couleur: '#000000',
      vin: '',
      service: '',
      chauffeur: '',

      carburant: '',
      kilometrage: '',
      dateMiseEnService: null,
      capacitePassagers: '',
      chargeUtile: '',
      etat: 'bon',
      description: '',

      controle: null,
      maintenance: null,
      assuranceCompagnie: '',
      assuranceContrat: '',
      assuranceExpiration: null,

      hasGPS: false,
      zone: '',

      montant: '',
      joursSortie: [false, false, false, false, false, false, false],
      heureSortie: '',
      heureEntree: '',
    })

    // Méthodes
    const uploadPhoto = () => {
      if (photoInput.value) {
        photoInput.value.click()
      }
    }

    const onPhotoSelected = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.files && input.files.length > 0) {
        const file = input.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          vehiclePhoto.value = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }
    }

    const formatDate = (date: Date) => {
      return format(date, 'dd MMMM yyyy', { locale: fr })
    }

    const submitForm = () => {
      console.log('Formulaire soumis:', form)
      // Ici, vous pourriez ajouter une validation de formulaire avant de soumettre
      // Puis, envoyer les données à votre API ou à votre store
      emit('close')
    }

    return {
      photoInput,
      vehiclePhoto,
      marques,
      annees,
      chauffeurs,
      jours,
      heures,
      colorOptions,
      form,
      uploadPhoto,
      onPhotoSelected,
      formatDate,
      submitForm,
    }
  },
})
</script>

<style scoped>
/* Styles spécifiques au modal, si nécessaire */
</style>
