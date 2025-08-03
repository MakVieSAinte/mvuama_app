<template>
  <Dialog
    :open="props.open"
    @update:open="
      (val) => {
        if (!val) emit('close')
      }
    "
  >
    <DialogContent class="z-[9999] p-0 bg-transparent" style="pointer-events: all">
      <div
        class="max-w-5xl w-full max-h-[90vh] flex flex-col bg-background rounded-3xl shadow-2xl overflow-hidden"
      >
        <DialogHeader>
          <DialogTitle>Ajouter un véhicule à la flotte</DialogTitle>
        </DialogHeader>
        <div class="space-y-10 w-full h-full overflow-y-auto py-4 px-8">
          <!-- 1️⃣ Infos générales -->
          <h3 class="text-2xl font-bold mb-2">1️⃣ Informations générales</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Input label="Marque du véhicule" placeholder="Ex : Toyota" v-model="form.marque" />
              <p class="text-xs text-muted-foreground mt-1">
                Indiquez la marque constructeur (ex : Toyota, Renault...)
              </p>
            </div>
            <div>
              <Input label="Modèle" placeholder="Ex : Corolla" v-model="form.modele" />
              <p class="text-xs text-muted-foreground mt-1">
                Modèle précis du véhicule (ex : Clio, 208...)
              </p>
            </div>
            <div>
              <Input
                label="Année de fabrication"
                placeholder="Ex : 2022"
                type="number"
                v-model="form.annee"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Année du modèle ou de première mise en circulation
              </p>
            </div>
            <div>
              <Input
                label="Numéro d’immatriculation"
                placeholder="Ex : AB-123-CD"
                v-model="form.immatriculation"
              />
              <p class="text-xs text-muted-foreground mt-1">Plaque d’immatriculation officielle</p>
            </div>
            <div>
              <Select v-model="form.type">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Voiture">Voiture</SelectItem>
                  <SelectItem value="Utilitaire">Utilitaire</SelectItem>
                  <SelectItem value="Camion">Camion</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Moto">Moto</SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground mt-1">
                Catégorie principale (voiture, utilitaire...)
              </p>
            </div>
            <div>
              <Select v-model="form.statut">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponible">Actif</SelectItem>
                  <SelectItem value="Maintenance">En révision</SelectItem>
                  <SelectItem value="Hors service">En panne</SelectItem>
                  <SelectItem value="Vendu">Vendu</SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground mt-1">
                État d’utilisation actuel du véhicule
              </p>
            </div>
            <div>
              <Input
                label="Date d’achat / mise en service"
                type="date"
                v-model="form.dateMiseEnService"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Date d’acquisition ou de première utilisation
              </p>
            </div>
          </div>
          <!-- Galerie photo -->
          <div>
            <h4 class="text-lg font-semibold mb-2 mt-6">Photos du véhicule</h4>
            <div class="flex flex-col md:flex-row gap-4 items-start">
              <Input label="Photo principale" type="file" @change="onFileChange($event, 'photo')" />
              <Input
                label="Galerie de photos (optionnel)"
                type="file"
                multiple
                @change="onFileChange($event, 'galerie')"
              />
            </div>
            <p class="text-xs text-muted-foreground mt-1">
              Ajoutez une photo principale et d’autres images si besoin (intérieur, extérieur...)
            </p>
          </div>
          <Separator />
          <!-- 2️⃣ Infos techniques -->
          <h3 class="text-2xl font-bold mb-2">2️⃣ Informations techniques</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Input
                label="Numéro de châssis (VIN)"
                placeholder="Ex : VF1AB123456789012"
                v-model="form.vin"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Identifiant unique du véhicule (important pour l’assurance et les pièces)
              </p>
            </div>
            <div>
              <Input label="Numéro de moteur" placeholder="Ex : MTR123456" v-model="form.moteur" />
              <p class="text-xs text-muted-foreground mt-1">
                Numéro du moteur (facultatif, utile pour le suivi administratif)
              </p>
            </div>
            <div>
              <Input
                label="Kilométrage actuel"
                placeholder="Ex : 32000"
                type="number"
                v-model="form.kilometrage"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Kilométrage relevé à l’enregistrement
              </p>
            </div>
            <div>
              <Select v-model="form.carburant">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Essence">Essence</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Électrique">Électrique</SelectItem>
                  <SelectItem value="Hybride">Hybride</SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground mt-1">Type de carburant utilisé</p>
            </div>
            <div>
              <Select v-model="form.transmission">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manuelle">Manuelle</SelectItem>
                  <SelectItem value="Automatique">Automatique</SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground mt-1">Boîte de vitesses</p>
            </div>
            <div>
              <Input label="Puissance (CV/kW)" placeholder="Ex : 110 CV" v-model="form.puissance" />
              <p class="text-xs text-muted-foreground mt-1">Puissance moteur (si pertinent)</p>
            </div>
            <div>
              <Input label="Couleur" placeholder="Ex : Blanc" v-model="form.couleur" />
              <p class="text-xs text-muted-foreground mt-1">Couleur principale du véhicule</p>
            </div>
          </div>
          <Separator />
          <!-- 3️⃣ Documents & papiers -->
          <h3 class="text-2xl font-bold mb-2">3️⃣ Documents & papiers</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Input
                label="Carte grise (numéro)"
                placeholder="Numéro de la carte grise"
                v-model="form.carteGriseNum"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Numéro officiel du certificat d’immatriculation
              </p>
            </div>
            <div>
              <Input
                label="Carte grise (scan)"
                type="file"
                @change="onFileChange($event, 'carteGriseScan')"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Téléchargez une copie scannée de la carte grise
              </p>
            </div>
            <div>
              <Input
                label="Assurance (numéro police)"
                placeholder="Numéro de police"
                v-model="form.assuranceNum"
              />
              <p class="text-xs text-muted-foreground mt-1">Numéro du contrat d’assurance</p>
            </div>
            <div>
              <Input
                label="Assurance (compagnie)"
                placeholder="Compagnie d’assurance"
                v-model="form.assuranceCompagnie"
              />
              <p class="text-xs text-muted-foreground mt-1">Nom de la compagnie d’assurance</p>
            </div>
            <div>
              <Input
                label="Assurance (expiration)"
                type="date"
                v-model="form.assuranceExpiration"
              />
              <p class="text-xs text-muted-foreground mt-1">Date d’expiration de l’assurance</p>
            </div>
            <div>
              <Input
                label="Assurance (PDF/photo)"
                type="file"
                @change="onFileChange($event, 'assuranceDoc')"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Ajoutez une copie du contrat ou attestation
              </p>
            </div>
            <div>
              <Input
                label="Contrôle technique (date)"
                type="date"
                v-model="form.controleTechniqueDate"
              />
              <p class="text-xs text-muted-foreground mt-1">Date du dernier contrôle technique</p>
            </div>
            <div>
              <Input
                label="Contrôle technique (validité)"
                placeholder="Validité"
                v-model="form.controleTechniqueValidite"
              />
              <p class="text-xs text-muted-foreground mt-1">Validité du contrôle technique</p>
            </div>
            <div>
              <Input
                label="Vignette (si applicable)"
                placeholder="Numéro ou année"
                v-model="form.vignette"
              />
              <p class="text-xs text-muted-foreground mt-1">Numéro ou année de la vignette</p>
            </div>
            <div>
              <Input
                label="Autres documents"
                type="file"
                multiple
                @change="onFileChange($event, 'autresDocs')"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Certificat d’importation, carnet d’entretien, etc.
              </p>
            </div>
          </div>
          <Separator />
          <!-- 4️⃣ Infos financières -->
          <h3 class="text-2xl font-bold mb-2">4️⃣ Informations financières</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Input
                label="Prix d’achat (€)"
                placeholder="Ex : 15000"
                type="number"
                v-model="form.prixAchat"
              />
              <p class="text-xs text-muted-foreground mt-1">Prix d’achat ou valeur estimée</p>
            </div>
            <div>
              <Select v-model="form.modeAcquisition">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Achat comptant">Achat comptant</SelectItem>
                  <SelectItem value="Crédit">Crédit</SelectItem>
                  <SelectItem value="Leasing">Leasing</SelectItem>
                  <SelectItem value="Location">Location</SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground mt-1">Comment le véhicule a été acquis</p>
            </div>
            <div>
              <Input
                label="Frais annexes initiaux (€)"
                placeholder="Ex : 500"
                type="number"
                v-model="form.fraisAnnexes"
              />
              <p class="text-xs text-muted-foreground mt-1">Frais d’immatriculation, taxes, etc.</p>
            </div>
          </div>
          <Separator />
          <!-- 5️⃣ Affectation & suivi -->
          <h3 class="text-2xl font-bold mb-2">5️⃣ Affectation & suivi</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Input
                label="Chauffeur assigné"
                placeholder="Nom du chauffeur ou 'Non assigné'"
                v-model="form.chauffeur"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Nom du chauffeur principal (ou laisser vide)
              </p>
            </div>
            <div>
              <Input
                label="Lieu d’affectation / parking principal"
                placeholder="Ex : Garage central"
                v-model="form.lieuAffectation"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Lieu où le véhicule est habituellement stationné
              </p>
            </div>
          </div>
          <Separator />
          <!-- 6️⃣ Options & remarques -->
          <h3 class="text-2xl font-bold mb-2">6️⃣ Options & remarques</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Select v-model="form.etat">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Neuf">Neuf</SelectItem>
                  <SelectItem value="Occasion">Occasion</SelectItem>
                  <SelectItem value="État moyen">État moyen</SelectItem>
                  <SelectItem value="Accidenté réparé">Accidenté réparé</SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground mt-1">État général à l’enregistrement</p>
            </div>
            <div>
              <Input
                label="Accessoires (GPS, équipements spéciaux...)"
                placeholder="Liste des accessoires"
                v-model="form.accessoires"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Listez les équipements ou accessoires particuliers
              </p>
            </div>
            <div class="md:col-span-3">
              <Textarea
                label="Notes internes"
                placeholder="Commentaires, remarques..."
                rows="2"
                v-model="form.notes"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Ajoutez toute information utile ou commentaire libre
              </p>
            </div>
          </div>
        </div>
        <DialogFooter class="mt-8">
          <Button variant="outline" @click="$emit('close')">Fermer</Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['close'])

const form = ref({
  marque: '',
  modele: '',
  annee: '',
  immatriculation: '',
  type: '',
  statut: '',
  dateMiseEnService: '',
  photo: null,
  vin: '',
  moteur: '',
  kilometrage: '',
  carburant: '',
  transmission: '',
  puissance: '',
  couleur: '',
  carteGriseNum: '',
  carteGriseScan: null,
  assuranceNum: '',
  assuranceCompagnie: '',
  assuranceExpiration: '',
  assuranceDoc: null,
  controleTechniqueDate: '',
  controleTechniqueValidite: '',
  vignette: '',
  autresDocs: null,
  prixAchat: '',
  modeAcquisition: '',
  fraisAnnexes: '',
  chauffeur: '',
  lieuAffectation: '',
  etat: '',
  accessoires: '',
  notes: '',
})

function onFileChange(event: Event, key: string) {
  const target = event.target as HTMLInputElement
  const files = target.files
  form.value[key] = files && files.length > 1 ? Array.from(files) : files?.[0] || null
}
</script>
