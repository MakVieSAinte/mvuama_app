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
        <div class="space-y-6">
          <!-- 1️⃣ Informations essentielles -->
          <div class="bg-muted/20 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info class="h-5 w-5" />
              Informations essentielles
            </h3>
            
            <!-- Section photos avec upload multiple -->
            <div class="mb-6">
              <Label class="text-base font-semibold mb-4 block">Photos du véhicule</Label>
              <div class="space-y-4">
                <!-- Zone d'upload -->
                <div
                  class="relative h-32 w-full rounded-md border-2 border-dashed border-muted-foreground/50 flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  @click="uploadPhotos"
                >
                  <div class="text-center p-4">
                    <ImageIcon class="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p class="text-sm text-muted-foreground">
                      Cliquez pour ajouter des photos ou glissez-déposez
                    </p>
                    <p class="text-xs text-muted-foreground mt-1">
                      Formats acceptés : JPG, PNG, WEBP (max 5 images)
                    </p>
                  </div>
                  <input
                    ref="photosInput"
                    type="file"
                    accept="image/*"
                    multiple
                    class="hidden"
                    @change="onPhotosSelected"
                  />
                </div>
                <!-- Aperçu des images -->
                <div v-if="vehiclePhotos.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div
                    v-for="(photo, index) in vehiclePhotos"
                    :key="index"
                    class="relative group"
                  >
                    <img
                      :src="photo.url"
                      :alt="`Photo ${index + 1}`"
                      class="h-24 w-full object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      class="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      @click="removePhoto(index)"
                    >
                      <X class="h-3 w-3" />
                    </Button>
                    <div
                      v-if="index === 0"
                      class="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded"
                    >
                      Principal
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Champs de base -->
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label for="marque" class="mb-3 block">
                  Marque <span class="text-red-500">*</span>
                </Label>
                <Select v-model="form.marque">
                  <SelectTrigger id="marque" class="w-full focus:border-primary focus:ring-primary border-2">
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
                <Label for="modele" class="mb-3 block">
                  Modèle <span class="text-red-500">*</span>
                </Label>
                <Input 
                  id="modele" 
                  v-model="form.modele" 
                  placeholder="Modèle du véhicule"
                  class="focus:border-primary focus:ring-primary border-2"
                />
              </div>
              
              <div>
                <Label for="annee" class="mb-3 block">
                  Année <span class="text-red-500">*</span>
                </Label>
                <Select v-model="form.annee">
                  <SelectTrigger id="annee" class="w-full focus:border-primary focus:ring-primary border-2">
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="annee in annees" :key="annee" :value="annee">
                      {{ annee }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label for="immatriculation" class="mb-3 block">
                  Numéro d'immatriculation <span class="text-red-500">*</span>
                </Label>
                <Input
                  id="immatriculation"
                  v-model="form.immatriculation"
                  placeholder="AA-123-BB"
                  class="uppercase focus:border-primary focus:ring-primary border-2"
                />
              </div>
              
              <div>
                <Label for="type" class="mb-3 block">
                  Type de véhicule <span class="text-red-500">*</span>
                </Label>
                <Select v-model="form.type">
                  <SelectTrigger id="type" class="w-full focus:border-primary focus:ring-primary border-2">
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
                <Label for="statut" class="mb-3 block">
                  Statut <span class="text-red-500">*</span>
                </Label>
                <ColoredSelect
                  v-model="form.statut"
                  :items="vehicleStatuses"
                  placeholder="Sélectionner un statut"
                  trigger-class="w-full focus:border-primary focus:ring-primary border-2"
                />
              </div>
              
              <div>
                <Label for="carburant" class="mb-3 block">
                  Carburant <span class="text-red-500">*</span>
                </Label>
                <ColoredSelect
                  v-model="form.carburant"
                  :items="fuelTypes"
                  placeholder="Type de carburant"
                  trigger-class="w-full focus:border-primary focus:ring-primary border-2"
                />
              </div>
              
              <div>
                <Label for="chauffeur" class="mb-3 block">Conducteur attitré</Label>
                <ChauffeurSelect
                  v-model="form.chauffeur"
                  :chauffeurs="chauffeurs"
                  placeholder="Sélectionner un conducteur"
                  trigger-class="w-full focus:border-primary focus:ring-primary border-2"
                />
              </div>
              
              <div>
                <Label for="kilometrage" class="mb-3 block">Kilométrage initial</Label>
                <div class="flex">
                  <Input
                    id="kilometrage"
                    v-model="form.kilometrage"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    class="rounded-r-none focus:border-primary focus:ring-primary border-2"
                  />
                  <div
                    class="inline-flex items-center justify-center rounded-r-md border border-l-0 border-input bg-muted px-3"
                  >
                    <span class="text-sm text-muted-foreground">km</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Section GPS -->
            <div class="mt-6">
              <h4 class="text-base font-semibold mb-4 flex items-center gap-2">
                <Satellite class="h-4 w-4" />
                Informations GPS
              </h4>
              <div class="flex items-center gap-2 mb-4">
                <Checkbox id="hasGPS" v-model="form.hasGPS" />
                <Label for="hasGPS" class="text-sm font-medium">Équipé d'un GPS</Label>
              </div>
              
              <div v-if="form.hasGPS" class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <Label for="gpsImei" class="mb-2 block">IMEI</Label>
                  <Input
                    id="gpsImei"
                    v-model="form.gpsImei"
                    placeholder="Numéro IMEI"
                    class="focus:border-primary focus:ring-primary border-2"
                  />
                </div>
                <div>
                  <Label for="gpsNumeroSerie" class="mb-2 block">Numéro de série</Label>
                  <Input
                    id="gpsNumeroSerie"
                    v-model="form.gpsNumeroSerie"
                    placeholder="Numéro de série"
                    class="focus:border-primary focus:ring-primary border-2"
                  />
                </div>
                <div>
                  <Label for="gpsFournisseur" class="mb-2 block">Fournisseur</Label>
                  <Input
                    id="gpsFournisseur"
                    v-model="form.gpsFournisseur"
                    placeholder="Nom du fournisseur"
                    class="focus:border-primary focus:ring-primary border-2"
                  />
                </div>
                <div>
                  <Label for="gpsModele" class="mb-2 block">Modèle GPS</Label>
                  <Input
                    id="gpsModele"
                    v-model="form.gpsModele"
                    placeholder="Modèle du GPS"
                    class="focus:border-primary focus:ring-primary border-2"
                  />
                </div>
              </div>
            </div>
            
            <!-- Description -->
            <div class="mt-6">
              <Label for="description" class="mb-3 block">Description détaillée</Label>
              <Textarea
                id="description"
                v-model="form.description"
                placeholder="Description complète du véhicule, particularités, équipements spéciaux..."
                rows="4"
                class="focus:border-primary focus:ring-primary border-2 min-h-[120px]"
              />
            </div>
            
            <!-- Section Documents -->
            <div class="mt-6">
              <DocumentUploader :existing-documents="existingDocuments" />
            </div>
          </div>
        </div>
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

// Import des composants personnalisés
import ColoredSelect from '@/components/ui/ColoredSelect.vue'
import ChauffeurSelect from '@/components/ui/ChauffeurSelect.vue'
import DocumentUploader from '@/components/ui/DocumentUploader.vue'

// Import des configurations
import {
  VEHICLE_STATUSES,
  FUEL_TYPES,
  generateInitials,
  getInitialsColor,
  type ChauffeurConfig,
} from '@/config/vehiculeConfig'

// Import des icônes
import {
  Info,
  ImageIcon,
  X,
  Satellite,
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
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
    Checkbox,

    // Composants personnalisés
    ColoredSelect,
    ChauffeurSelect,
    DocumentUploader,

    // Icônes
    Info,
    ImageIcon,
    X,
    Satellite,
  },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],

  setup(props, { emit }) {
    // Références pour l'upload multiple d'images
    const photosInput = ref<HTMLInputElement | null>(null)
    const vehiclePhotos = ref<Array<{ url: string; file: File }>>([])

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

    // Configuration des chauffeurs avec photos et initiales
    const chauffeurs: ChauffeurConfig[] = [
      { 
        id: 1, 
        nom: 'Ahmed Ben Ali',
        initiales: generateInitials('Ahmed Ben Ali'),
        couleurInitiales: getInitialsColor('Ahmed Ben Ali'),
        photo: undefined
      },
      { 
        id: 2, 
        nom: 'Fatima Zahra',
        initiales: generateInitials('Fatima Zahra'),
        couleurInitiales: getInitialsColor('Fatima Zahra'),
        photo: undefined
      },
      { 
        id: 3, 
        nom: 'Mohamed Tounsi',
        initiales: generateInitials('Mohamed Tounsi'),
        couleurInitiales: getInitialsColor('Mohamed Tounsi'),
        photo: undefined
      },
      { 
        id: 4, 
        nom: 'Aisha Mansouri',
        initiales: generateInitials('Aisha Mansouri'),
        couleurInitiales: getInitialsColor('Aisha Mansouri'),
        photo: undefined
      },
      { 
        id: 5, 
        nom: 'Youssef Khalil',
        initiales: generateInitials('Youssef Khalil'),
        couleurInitiales: getInitialsColor('Youssef Khalil'),
        photo: undefined
      },
    ]

    // Documents existants (simulés)
    const existingDocuments = ref([
      { id: '1', name: 'Carte grise standard', type: 'PDF' },
      { id: '2', name: 'Contrat assurance véhicule', type: 'PDF' },
      { id: '3', name: 'Manuel utilisateur', type: 'PDF' },
      { id: '4', name: 'Certificat conformité', type: 'PDF' },
    ])

    // Formulaire étendu avec nouveaux champs
    const form = reactive({
      marque: '',
      modele: '',
      annee: new Date().getFullYear().toString(),
      immatriculation: '',
      type: '',
      statut: 'disponible',
      couleur: '#000000',
      vin: '',
      service: '',
      chauffeur: '',

      carburant: '',
      kilometrage: '',
      dateMiseEnService: undefined as Date | undefined,
      capacitePassagers: '',
      chargeUtile: '',
      etat: 'bon',
      description: '',

      controle: undefined as Date | undefined,
      maintenance: undefined as Date | undefined,
      assuranceCompagnie: '',
      assuranceContrat: '',
      assuranceExpiration: undefined as Date | undefined,

      hasGPS: false,
      zone: '',

      // Informations GPS
      gpsImei: '',
      gpsNumeroSerie: '',
      gpsFournisseur: '',
      gpsModele: '',
      gpsDateInstallation: undefined as Date | undefined,
      gpsStatut: 'actif' as 'actif' | 'inactif' | 'maintenance',

      montant: '',
      joursSortie: [false, false, false, false, false, false, false],
      heureSortie: '',
      heureEntree: '',
    })

    // Méthodes pour gérer les images multiples
    const uploadPhotos = () => {
      if (photosInput.value) {
        photosInput.value.click()
      }
    }

    const onPhotosSelected = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.files && input.files.length > 0) {
        const files = Array.from(input.files)
        
        // Vérifier qu'on ne dépasse pas 5 images au total
        if (vehiclePhotos.value.length + files.length > 5) {
          alert('Vous ne pouvez ajouter que 5 images maximum')
          return
        }

        files.forEach(file => {
          const reader = new FileReader()
          reader.onload = (e) => {
            vehiclePhotos.value.push({
              url: e.target?.result as string,
              file: file
            })
          }
          reader.readAsDataURL(file)
        })
      }
    }

    const removePhoto = (index: number) => {
      vehiclePhotos.value.splice(index, 1)
    }

    const formatDate = (date: Date) => {
      return format(date, 'dd MMMM yyyy', { locale: fr })
    }

    const submitForm = () => {
      console.log('Formulaire soumis:', form)
      console.log('Photos:', vehiclePhotos.value)
      emit('close')
    }

    return {
      // Références et données images
      photosInput,
      vehiclePhotos,
      
      // Données de configuration
      marques,
      annees,
      chauffeurs,
      existingDocuments,
      
      // Configurations des statuts et carburants
      vehicleStatuses: VEHICLE_STATUSES,
      fuelTypes: FUEL_TYPES,
      
      // Formulaire
      form,
      
      // Méthodes
      uploadPhotos,
      onPhotosSelected,
      removePhoto,
      formatDate,
      submitForm,
    }
  },
})
</script>
