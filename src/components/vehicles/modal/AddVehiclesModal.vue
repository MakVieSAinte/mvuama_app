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
          <!-- Accordéon pour organiser les sections -->
          <Accordion
            type="multiple"
            default-value="['info-base', 'info-tech', 'documents', 'finance']"
            class="w-full space-y-4"
          >
            <!-- 1️⃣ Informations de base -->
            <AccordionItem
              value="info-base"
              class="border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger
                class="text-lg font-semibold hover:no-underline bg-muted/30 px-6 py-4 border-b border-border"
              >
                <div class="flex items-center gap-2">
                  <Info class="h-5 w-5" />
                  Informations de base
                </div>
              </AccordionTrigger>
              <AccordionContent class="space-y-6 pt-4 bg-muted/10 px-6 pb-6">
                <!-- Section photos avec upload multiple -->
                <div>
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
                    <div
                      v-if="vehiclePhotos.length > 0"
                      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
                    >
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
                      <SelectTrigger
                        id="marque"
                        class="w-full focus:border-primary focus:ring-primary border-2"
                      >
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
                      <SelectTrigger
                        id="annee"
                        class="w-full focus:border-primary focus:ring-primary border-2"
                      >
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
                      <SelectTrigger
                        id="type"
                        class="w-full focus:border-primary focus:ring-primary border-2"
                      >
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
                    <Select v-model="form.statut">
                      <SelectTrigger
                        id="statut"
                        class="w-full focus:border-primary focus:ring-primary border-2"
                      >
                        <SelectValue placeholder="Sélectionner un statut">
                          <div v-if="selectedStatus" class="flex items-center gap-2">
                            <div
                              class="w-3 h-3 rounded-full"
                              :style="{ backgroundColor: selectedStatus.color }"
                            ></div>
                            <span>{{ selectedStatus.label }}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="status in vehicleStatuses"
                          :key="status.value"
                          :value="status.value"
                        >
                          <div class="flex items-center gap-2">
                            <div
                              class="w-3 h-3 rounded-full"
                              :style="{ backgroundColor: status.color }"
                            ></div>
                            <span>{{ status.label }}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label for="couleur" class="mb-3 block">Couleur</Label>
                    <div class="flex gap-2">
                      <Input
                        id="couleur"
                        v-model="form.couleur"
                        type="color"
                        class="w-16 h-10 p-1 rounded cursor-pointer border-2"
                      />
                      <Input
                        v-model="form.couleur"
                        placeholder="#000000"
                        class="flex-1 focus:border-primary focus:ring-primary border-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label for="vin" class="mb-3 block">Numéro VIN</Label>
                    <Input
                      id="vin"
                      v-model="form.vin"
                      placeholder="Numéro de châssis"
                      class="uppercase focus:border-primary focus:ring-primary border-2"
                    />
                  </div>

                  <div>
                    <Label for="service" class="mb-3 block">Service / Département</Label>
                    <Select v-model="form.service">
                      <SelectTrigger
                        id="service"
                        class="w-full focus:border-primary focus:ring-primary border-2"
                      >
                        <SelectValue placeholder="Sélectionner un service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direction">Direction</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="technique">Technique</SelectItem>
                        <SelectItem value="logistique">Logistique</SelectItem>
                        <SelectItem value="administration">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <!-- Conducteur attitré -->
                <div>
                  <Label for="chauffeur" class="mb-3 block">Conducteur attitré</Label>
                  <Select v-model="form.chauffeur">
                    <SelectTrigger
                      id="chauffeur"
                      class="w-full focus:border-primary focus:ring-primary border-2"
                    >
                      <SelectValue placeholder="Sélectionner un conducteur">
                        <div v-if="selectedChauffeur" class="flex items-center gap-3">
                          <div class="relative">
                            <img
                              v-if="selectedChauffeur.photo"
                              :src="selectedChauffeur.photo"
                              :alt="selectedChauffeur.nom"
                              class="w-6 h-6 rounded-full object-cover border"
                            />
                            <div
                              v-else
                              class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium border"
                              :style="{ backgroundColor: selectedChauffeur.couleurInitiales }"
                            >
                              {{ selectedChauffeur.initiales }}
                            </div>
                          </div>
                          <span class="font-medium">{{ selectedChauffeur.nom }}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="chauffeur in chauffeurs"
                        :key="chauffeur.id"
                        :value="chauffeur.id.toString()"
                        class="py-3"
                      >
                        <div class="flex items-center gap-3">
                          <div class="relative">
                            <img
                              v-if="chauffeur.photo"
                              :src="chauffeur.photo"
                              :alt="chauffeur.nom"
                              class="w-6 h-6 rounded-full object-cover border"
                            />
                            <div
                              v-else
                              class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium border"
                              :style="{ backgroundColor: chauffeur.couleurInitiales }"
                            >
                              {{ chauffeur.initiales }}
                            </div>
                          </div>
                          <span class="font-medium">{{ chauffeur.nom }}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="aucun" class="py-3">
                        <div class="flex items-center gap-3">
                          <div
                            class="w-6 h-6 rounded-full bg-muted flex items-center justify-center"
                          >
                            <span class="text-xs text-muted-foreground">-</span>
                          </div>
                          <span class="font-medium text-muted-foreground"
                            >Aucun conducteur attitré</span
                          >
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <!-- 2️⃣ Informations techniques -->
            <AccordionItem
              value="info-tech"
              class="border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger
                class="text-lg font-semibold hover:no-underline bg-muted/30 px-6 py-4 border-b border-border"
              >
                <div class="flex items-center gap-2">
                  <Settings class="h-5 w-5" />
                  Informations techniques
                </div>
              </AccordionTrigger>
              <AccordionContent class="space-y-6 pt-4 bg-muted/10 px-6 pb-6">
                <!-- Carburant et moteur -->
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <Label for="carburant" class="mb-3 block">
                      Carburant <span class="text-red-500">*</span>
                    </Label>
                    <Select v-model="form.carburant">
                      <SelectTrigger
                        id="carburant"
                        class="w-full focus:border-primary focus:ring-primary border-2"
                      >
                        <SelectValue placeholder="Type de carburant">
                          <div v-if="selectedFuel" class="flex items-center gap-2">
                            <div
                              class="w-3 h-3 rounded-full"
                              :style="{ backgroundColor: selectedFuel.color }"
                            ></div>
                            <span>{{ selectedFuel.label }}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="fuel in fuelTypes" :key="fuel.value" :value="fuel.value">
                          <div class="flex items-center gap-2">
                            <div
                              class="w-3 h-3 rounded-full"
                              :style="{ backgroundColor: fuel.color }"
                            ></div>
                            <span>{{ fuel.label }}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label for="kilometrage" class="mb-3 block">Kilométrage initial</Label>
                    <NumberInput
                      id="kilometrage"
                      v-model="form.kilometrage"
                      :min="0"
                      :step="1"
                      placeholder="0"
                      suffix="km"
                      class="focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label for="dateMiseEnService" class="mb-3 block"
                      >Date de mise en service</Label
                    >
                    <DatePicker
                      id="dateMiseEnService"
                      v-model="form.dateMiseEnService"
                      placeholder="Sélectionner la date de mise en service"
                      class="focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label for="capacitePassagers" class="mb-3 block">Capacité passagers</Label>
                    <NumberInput
                      id="capacitePassagers"
                      v-model="form.capacitePassagers"
                      :min="1"
                      :max="50"
                      placeholder="Nombre de places"
                      class="focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label for="chargeUtile" class="mb-3 block">Charge utile (kg)</Label>
                    <NumberInput
                      id="chargeUtile"
                      v-model="form.chargeUtile"
                      :min="0"
                      placeholder="Poids maximum transportable"
                      suffix="kg"
                      class="focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label for="etat" class="mb-3 block">État général</Label>
                    <Select v-model="form.etat">
                      <SelectTrigger
                        id="etat"
                        class="w-full focus:border-primary focus:ring-primary border-2"
                      >
                        <SelectValue placeholder="État du véhicule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="bon">Bon</SelectItem>
                        <SelectItem value="moyen">Moyen</SelectItem>
                        <SelectItem value="mauvais">Mauvais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <Label for="description" class="mb-3 block">Description détaillée</Label>
                  <Textarea
                    id="description"
                    v-model="form.description"
                    placeholder="Description complète du véhicule, particularités, équipements spéciaux..."
                    rows="4"
                    class="focus:border-primary focus:ring-primary border-2 min-h-[120px]"
                  />
                </div>

                <!-- Section GPS -->
                <div>
                  <h4 class="text-base font-semibold mb-4 flex items-center gap-2">
                    <Satellite class="h-4 w-4" />
                    Informations GPS
                  </h4>
                  <div class="flex items-center gap-2 mb-4">
                    <Checkbox id="hasGPS" v-model="form.hasGPS" />
                    <Label for="hasGPS" class="text-sm font-medium">Équipé d'un GPS</Label>
                  </div>

                  <div v-if="form.hasGPS" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                    <div>
                      <Label for="gpsDateInstallation" class="mb-2 block"
                        >Date d'installation</Label
                      >
                      <DatePicker
                        id="gpsDateInstallation"
                        v-model="form.gpsDateInstallation"
                        placeholder="Date d'installation du GPS"
                        class="focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <Label for="gpsStatut" class="mb-2 block">Statut GPS</Label>
                      <Select v-model="form.gpsStatut">
                        <SelectTrigger
                          id="gpsStatut"
                          class="w-full focus:border-primary focus:ring-primary border-2"
                        >
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="actif">Actif</SelectItem>
                          <SelectItem value="inactif">Inactif</SelectItem>
                          <SelectItem value="maintenance">En maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <!-- 3️⃣ Documents et certifications -->
            <AccordionItem
              value="documents"
              class="border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger
                class="text-lg font-semibold hover:no-underline bg-muted/30 px-6 py-4 border-b border-border"
              >
                <div class="flex items-center gap-2">
                  <FileText class="h-5 w-5" />
                  Documents et certifications
                </div>
              </AccordionTrigger>
              <AccordionContent class="space-y-6 pt-4 bg-muted/10 px-6 pb-6">
                <!-- Dates importantes -->
                <div class="grid gap-6 md:grid-cols-3">
                  <div>
                    <Label for="controle" class="mb-3 block">Prochain contrôle technique</Label>
                    <DatePicker
                      id="controle"
                      v-model="form.controle"
                      placeholder="Date du prochain contrôle"
                      class="focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label for="maintenance" class="mb-3 block">Prochaine maintenance</Label>
                    <DatePicker
                      id="maintenance"
                      v-model="form.maintenance"
                      placeholder="Date de la prochaine maintenance"
                      class="focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label for="assuranceExpiration" class="mb-3 block">Expiration assurance</Label>
                    <DatePicker
                      id="assuranceExpiration"
                      v-model="form.assuranceExpiration"
                      placeholder="Date d'expiration de l'assurance"
                      class="focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <!-- Informations assurance -->
                <div class="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label for="assuranceCompagnie" class="mb-3 block">Compagnie d'assurance</Label>
                    <Input
                      id="assuranceCompagnie"
                      v-model="form.assuranceCompagnie"
                      placeholder="Nom de la compagnie"
                      class="focus:border-primary focus:ring-primary border-2"
                    />
                  </div>

                  <div>
                    <Label for="assuranceContrat" class="mb-3 block">Numéro de contrat</Label>
                    <Input
                      id="assuranceContrat"
                      v-model="form.assuranceContrat"
                      placeholder="Référence du contrat"
                      class="focus:border-primary focus:ring-primary border-2"
                    />
                  </div>
                </div>

                <!-- Section Upload Documents -->
                <div>
                  <Label class="text-base font-semibold mb-4 block">Documents du véhicule</Label>

                  <!-- Zone d'upload de nouveaux documents -->
                  <div class="space-y-4">
                    <div>
                      <Label class="text-sm font-medium mb-2 block"
                        >Ajouter de nouveaux documents</Label
                      >
                      <div
                        class="relative h-24 w-full rounded-md border-2 border-dashed border-muted-foreground/50 flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                        @click="uploadDocuments"
                      >
                        <div class="text-center p-3">
                          <FileText class="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                          <p class="text-xs text-muted-foreground">
                            Cliquez pour ajouter des documents
                          </p>
                          <p class="text-xs text-muted-foreground mt-1">PDF, Word, Excel, Images</p>
                        </div>
                        <input
                          ref="documentsInput"
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                          multiple
                          class="hidden"
                          @change="onDocumentsSelected"
                        />
                      </div>
                    </div>

                    <!-- Documents uploadés -->
                    <div v-if="uploadedDocuments.length > 0" class="space-y-2">
                      <Label class="text-sm font-medium">Documents ajoutés</Label>
                      <div class="space-y-2">
                        <div
                          v-for="(doc, index) in uploadedDocuments"
                          :key="index"
                          class="flex items-center justify-between p-2 bg-muted/30 rounded-md"
                        >
                          <div class="flex items-center gap-2">
                            <div class="p-1 rounded bg-primary/10">
                              <FileText class="h-4 w-4 text-primary" />
                            </div>
                            <span class="text-sm font-medium truncate">{{ doc.name }}</span>
                            <span class="text-xs text-muted-foreground"
                              >({{ formatFileSize(doc.size || 0) }})</span
                            >
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            @click="removeDocument(index)"
                          >
                            <X class="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <!-- Documents existants -->
                    <div v-if="existingDocuments.length > 0" class="space-y-2">
                      <Label class="text-sm font-medium">Documents existants</Label>
                      <div class="space-y-2">
                        <div
                          v-for="doc in existingDocuments"
                          :key="doc.id"
                          class="flex items-center justify-between p-2 bg-muted/20 rounded-md"
                        >
                          <div class="flex items-center gap-2">
                            <div class="p-1 rounded bg-blue-100">
                              <FileText class="h-4 w-4 text-blue-600" />
                            </div>
                            <span class="text-sm font-medium">{{ doc.name }}</span>
                            <span class="text-xs text-muted-foreground">({{ doc.type }})</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            @click="removeExistingDocument(doc.id)"
                          >
                            <X class="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <!-- 4️⃣ Informations financières -->
            <AccordionItem value="finance" class="border border-border rounded-lg overflow-hidden">
              <AccordionTrigger
                class="text-lg font-semibold hover:no-underline bg-muted/30 px-6 py-4 border-b border-border"
              >
                <div class="flex items-center gap-2">
                  <DollarSign class="h-5 w-5" />
                  Informations financières
                </div>
              </AccordionTrigger>
              <AccordionContent class="space-y-6 pt-4 bg-muted/10 px-6 pb-6">
                <!-- Planning et tarification -->
                <div class="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label for="montant" class="mb-3 block">Tarif journalier (€)</Label>
                    <NumberInput
                      id="montant"
                      v-model="form.montant"
                      :min="0"
                      step="0.01"
                      placeholder="0.00"
                      suffix="€"
                      class="focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label for="zone" class="mb-3 block">Zone d'opération</Label>
                    <Select v-model="form.zone">
                      <SelectTrigger
                        id="zone"
                        class="w-full focus:border-primary focus:ring-primary border-2"
                      >
                        <SelectValue placeholder="Sélectionner une zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urbaine">Zone urbaine</SelectItem>
                        <SelectItem value="periurbaine">Zone périurbaine</SelectItem>
                        <SelectItem value="rurale">Zone rurale</SelectItem>
                        <SelectItem value="nationale">Nationale</SelectItem>
                        <SelectItem value="internationale">Internationale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <!-- Planning de disponibilité -->
                <div>
                  <Label class="text-base font-semibold mb-4 block">Jours de disponibilité</Label>
                  <div class="grid grid-cols-7 gap-2">
                    <div
                      v-for="(jour, index) in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']"
                      :key="index"
                      class="text-center"
                    >
                      <Label :for="`jour-${index}`" class="block text-sm font-medium mb-2">
                        {{ jour }}
                      </Label>
                      <Checkbox
                        :id="`jour-${index}`"
                        v-model="form.joursSortie[index]"
                        class="mx-auto"
                      />
                    </div>
                  </div>
                </div>

                <!-- Horaires -->
                <div class="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label for="heureSortie" class="mb-3 block">Heure de début</Label>
                    <TimeInput
                      id="heureSortie"
                      v-model="form.heureSortie"
                      placeholder="08:00"
                      class="focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label for="heureEntree" class="mb-3 block">Heure de fin</Label>
                    <TimeInput
                      id="heureEntree"
                      v-model="form.heureEntree"
                      placeholder="18:00"
                      class="focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
import { defineComponent, ref, reactive, computed } from 'vue'

// Import des composants shadcn-vue
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
import { DatePicker } from '@/components/ui/date-picker'
import { NumberInput } from '@/components/ui/number-input'
import { TimeInput } from '@/components/ui/time-input'

// Import des configurations
import {
  VEHICLE_STATUSES,
  FUEL_TYPES,
  generateInitials,
  getInitialsColor,
  type ChauffeurConfig,
} from '@/config/vehicleConfig'

// Import des icônes
import {
  Info,
  ImageIcon,
  X,
  Satellite,
  Settings,
  FileText,
  DollarSign,
  CalendarIcon,
  Clock,
} from 'lucide-vue-next'

export default defineComponent({
  name: 'AjoutVehiculesModal',
  emits: ['close', 'vehicule-added'],
  components: {
    // Composants shadcn
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
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
    DatePicker,
    NumberInput,
    TimeInput,

    // Icônes
    Info,
    ImageIcon,
    X,
    Satellite,
    Settings,
    FileText,
    DollarSign,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    // Références pour l'upload multiple d'images
    const photosInput = ref<HTMLInputElement | null>(null)
    const vehiclePhotos = ref<Array<{ url: string; file: File }>>([])

    // Références pour l'upload de documents
    const documentsInput = ref<HTMLInputElement | null>(null)
    const uploadedDocuments = ref<File[]>([])

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
        photo: undefined,
      },
      {
        id: 2,
        nom: 'Fatima Zahra',
        initiales: generateInitials('Fatima Zahra'),
        couleurInitiales: getInitialsColor('Fatima Zahra'),
        photo: undefined,
      },
      {
        id: 3,
        nom: 'Mohamed Tounsi',
        initiales: generateInitials('Mohamed Tounsi'),
        couleurInitiales: getInitialsColor('Mohamed Tounsi'),
        photo: undefined,
      },
      {
        id: 4,
        nom: 'Aisha Mansouri',
        initiales: generateInitials('Aisha Mansouri'),
        couleurInitiales: getInitialsColor('Aisha Mansouri'),
        photo: undefined,
      },
      {
        id: 5,
        nom: 'Youssef Khalil',
        initiales: generateInitials('Youssef Khalil'),
        couleurInitiales: getInitialsColor('Youssef Khalil'),
        photo: undefined,
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
      dateMiseEnService: '',
      capacitePassagers: '',
      chargeUtile: '',
      etat: 'bon',
      description: '',

      controle: '',
      maintenance: '',
      assuranceCompagnie: '',
      assuranceContrat: '',
      assuranceExpiration: '',

      hasGPS: false,
      zone: '',

      // Informations GPS
      gpsImei: '',
      gpsNumeroSerie: '',
      gpsFournisseur: '',
      gpsModele: '',
      gpsDateInstallation: '',
      gpsStatut: 'actif' as 'actif' | 'inactif' | 'maintenance',

      montant: '',
      joursSortie: [false, false, false, false, false, false, false],
      heureSortie: '',
      heureEntree: '',
    })

    // Propriétés computed pour les sélections
    const selectedStatus = computed(() => {
      return VEHICLE_STATUSES.find((status) => status.value === form.statut)
    })

    const selectedFuel = computed(() => {
      return FUEL_TYPES.find((fuel) => fuel.value === form.carburant)
    })

    const selectedChauffeur = computed(() => {
      if (form.chauffeur === 'aucun') return null
      return chauffeurs.find((chauffeur) => chauffeur.id.toString() === form.chauffeur)
    })

    // Méthodes pour la gestion des photos
    const selectPhotos = () => {
      photosInput.value?.click()
    }

    const handlePhotoUpload = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.files) {
        Array.from(target.files).forEach((file) => {
          const url = URL.createObjectURL(file)
          vehiclePhotos.value.push({ url, file })
        })
      }
    }

    const removePhoto = (index: number) => {
      vehiclePhotos.value.splice(index, 1)
    }

    // Méthodes pour la gestion des documents
    const selectDocuments = () => {
      documentsInput.value?.click()
    }

    const handleDocumentUpload = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.files) {
        uploadedDocuments.value.push(...Array.from(target.files))
      }
    }

    const removeDocument = (index: number) => {
      uploadedDocuments.value.splice(index, 1)
    }

    const removeExistingDocument = (id: string) => {
      existingDocuments.value = existingDocuments.value.filter((doc) => doc.id !== id)
    }

    // Méthodes pour la soumission du formulaire
    const isFormValid = computed(() => {
      return form.marque && form.modele && form.annee && form.immatriculation
    })

    const validateForm = () => {
      if (!isFormValid.value) {
        // Afficher une erreur de validation
        return false
      }
      return true
    }

    const resetForm = () => {
      Object.assign(form, {
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
        dateMiseEnService: '',
        capacitePassagers: '',
        chargeUtile: '',
        etat: 'bon',
        description: '',
        controle: '',
        maintenance: '',
        assuranceCompagnie: '',
        assuranceContrat: '',
        assuranceExpiration: '',
        hasGPS: false,
        zone: '',
        gpsImei: '',
        gpsNumeroSerie: '',
        gpsFournisseur: '',
        gpsModele: '',
        gpsDateInstallation: '',
        gpsStatut: 'actif',
        montant: '',
        joursSortie: [false, false, false, false, false, false, false],
        heureSortie: '',
        heureEntree: '',
      })
      vehiclePhotos.value = []
      uploadedDocuments.value = []
    }

    const ajouterVehicule = async () => {
      if (!validateForm()) return

      try {
        // Préparer les données avec les photos et documents
        const vehicleData = {
          ...form,
          photos: vehiclePhotos.value.map((photo) => photo.file),
          documents: uploadedDocuments.value,
        }

        emit('vehicule-added', vehicleData)
        resetForm()
        emit('close')
      } catch (error) {
        console.error("Erreur lors de l'ajout du véhicule:", error)
      }
    }

    // Méthodes supplémentaires pour le template
    const uploadPhotos = () => {
      photosInput.value?.click()
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

        files.forEach((file) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            vehiclePhotos.value.push({
              url: e.target?.result as string,
              file: file,
            })
          }
          reader.readAsDataURL(file)
        })
      }
    }

    const uploadDocuments = () => {
      documentsInput.value?.click()
    }

    const onDocumentsSelected = (event: Event) => {
      handleDocumentUpload(event)
    }

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const submitForm = () => {
      ajouterVehicule()
    }

    return {
      photosInput,
      vehiclePhotos,
      documentsInput,
      uploadedDocuments,
      marques,
      annees,
      chauffeurs,
      existingDocuments,
      form,
      selectedStatus,
      selectedFuel,
      selectedChauffeur,
      selectPhotos,
      handlePhotoUpload,
      removePhoto,
      selectDocuments,
      handleDocumentUpload,
      removeDocument,
      removeExistingDocument,
      isFormValid,
      ajouterVehicule,
      resetForm,
      uploadPhotos,
      onPhotosSelected,
      uploadDocuments,
      onDocumentsSelected,
      formatFileSize,
      submitForm,
      VEHICLE_STATUSES,
      FUEL_TYPES,
      vehicleStatuses: VEHICLE_STATUSES,
      fuelTypes: FUEL_TYPES,
    }
  },
})
</script>

<style scoped>
.color-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.driver-initials {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  font-size: 10px;
  font-weight: 600;
  margin-right: 8px;
}

.photo-preview {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
}

.tabs-content {
  margin-top: 24px;
}

.gps-icon {
  color: #10b981;
  margin-right: 8px;
}

.form-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.form-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}
</style>
