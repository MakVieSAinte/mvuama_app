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
            <AccordionContent class="pt-6 px-4 pb-4 bg-muted/20 rounded-b-lg">
              <div class="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
                <!-- Section photos avec upload multiple -->
                <div class="col-span-full">
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
                <!-- Informations de base optimisées -->
                <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label for="marque" class="mb-3 block">
                      Marque <span class="text-red-500">*</span>
                    </Label>
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
                    <Label for="modele" class="mb-3 block">
                      Modèle <span class="text-red-500">*</span>
                    </Label>
                    <Input id="modele" v-model="form.modele" placeholder="Modèle du véhicule" />
                  </div>
                  <div>
                    <Label for="annee" class="mb-3 block">
                      Année <span class="text-red-500">*</span>
                    </Label>
                    <Select v-model="form.annee">
                      <SelectTrigger id="annee" class="w-full">
                        <SelectValue placeholder="Année" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="annee in annees" :key="annee" :value="annee">
                          {{ annee }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label for="immatriculation" class="mb-3 block">
                      Numéro d'immatriculation <span class="text-red-500">*</span>
                    </Label>
                    <Input
                      id="immatriculation"
                      v-model="form.immatriculation"
                      placeholder="AA-123-BB"
                      class="uppercase"
                    />
                  </div>
                  <div>
                    <Label for="type" class="mb-3 block">
                      Type de véhicule <span class="text-red-500">*</span>
                    </Label>
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
                </div>

                <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <Label for="couleur" class="mb-3 block">Couleur</Label>
                    <div class="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            class="w-[40px] h-[40px] p-0 border-2 focus:border-primary focus:ring-primary"
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
                              class="col-span-2 h-8 focus:border-primary focus:ring-primary"
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Input 
                        id="couleur" 
                        v-model="form.couleur" 
                        placeholder="#000000" 
                        class="focus:border-primary focus:ring-primary border-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label for="vin" class="mb-3 block">Numéro de série (VIN)</Label>
                    <Input 
                      id="vin" 
                      v-model="form.vin" 
                      placeholder="Numéro VIN" 
                      class="focus:border-primary focus:ring-primary border-2"
                    />
                  </div>
                </div>

                <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label for="service" class="mb-3 block">Affectation / Service</Label>
                    <Select v-model="form.service">
                      <SelectTrigger id="service" class="w-full focus:border-primary focus:ring-primary border-2">
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
                    <Label for="chauffeur" class="mb-3 block">Conducteur attitré</Label>
                    <ChauffeurSelect
                      v-model="form.chauffeur"
                      :chauffeurs="chauffeurs"
                      placeholder="Sélectionner un conducteur"
                      trigger-class="w-full focus:border-primary focus:ring-primary border-2"
                    />
                  </div>
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
            <AccordionContent class="pt-6 px-4 pb-4 bg-muted/20 rounded-b-lg">
              <div class="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
                <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div>
                    <Label for="etat" class="mb-3 block">État du véhicule</Label>
                    <Select v-model="form.etat">
                      <SelectTrigger id="etat" class="w-full focus:border-primary focus:ring-primary border-2">
                        <SelectValue placeholder="État" />
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
                </div>

                <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label for="dateMiseEnService" class="mb-3 block">Date de mise en service</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          class="w-full justify-start text-left font-normal focus:border-primary focus:ring-primary border-2"
                          :class="{ 'text-muted-foreground': !form.dateMiseEnService }"
                        >
                          <CalendarIcon class="mr-2 h-4 w-4" />
                          {{
                            form.dateMiseEnService
                              ? formatDate(form.dateMiseEnService)
                              : 'Date de service'
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
                    <Label for="capacitePassagers" class="mb-3 block">Capacité passagers</Label>
                    <Input
                      id="capacitePassagers"
                      v-model="form.capacitePassagers"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      class="focus:border-primary focus:ring-primary border-2"
                    />
                  </div>
                  <div>
                    <Label for="chargeUtile" class="mb-3 block">Charge utile</Label>
                    <div class="flex">
                      <Input
                        id="chargeUtile"
                        v-model="form.chargeUtile"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        class="rounded-r-none focus:border-primary focus:ring-primary border-2"
                      />
                      <div
                        class="inline-flex items-center justify-center rounded-r-md border border-l-0 border-input bg-muted px-3"
                      >
                        <span class="text-sm text-muted-foreground">kg</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="md:col-span-2">
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
                <div class="md:col-span-2">
                  <DocumentUploader :existing-documents="existingDocuments" />
                </div>
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
                    <Label for="etat" class="mb-3 block">État du véhicule</Label>
                    <Select v-model="form.etat">
                      <SelectTrigger id="etat" class="w-full">
                        <SelectValue placeholder="État" />
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
                </div>

                <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label for="dateMiseEnService" class="mb-3 block"
                      >Date de mise en service</Label
                    >
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
                              : 'Date de service'
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
                    <Label for="capacitePassagers" class="mb-3 block">Capacité passagers</Label>
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
                    <Label for="chargeUtile" class="mb-3 block">Charge utile</Label>
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
                </div>

                <div class="md:col-span-2">
                  <Label for="description" class="mb-3 block">Libellé / Description</Label>
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
            <AccordionContent class="pt-6 px-4 pb-4 bg-muted/20 rounded-b-lg">
              <div class="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
                <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label for="controle" class="mb-3 block">Prochain contrôle technique</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          class="w-full justify-start text-left font-normal"
                          :class="{ 'text-muted-foreground': !form.controle }"
                        >
                          <CalendarIcon class="mr-2 h-4 w-4" />
                          {{ form.controle ? formatDate(form.controle) : 'Date du contrôle' }}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="w-auto p-0">
                        <Calendar v-model="form.controle" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label for="maintenance" class="mb-3 block">Prochaine maintenance prévue</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          class="w-full justify-start text-left font-normal"
                          :class="{ 'text-muted-foreground': !form.maintenance }"
                        >
                          <CalendarIcon class="mr-2 h-4 w-4" />
                          {{
                            form.maintenance ? formatDate(form.maintenance) : 'Date de maintenance'
                          }}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="w-auto p-0">
                        <Calendar v-model="form.maintenance" />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label for="assuranceCompagnie" class="mb-3 block">Compagnie d'assurance</Label>
                    <Input
                      id="assuranceCompagnie"
                      v-model="form.assuranceCompagnie"
                      placeholder="Nom de la compagnie"
                    />
                  </div>
                  <div>
                    <Label for="assuranceContrat" class="mb-3 block">N° de contrat</Label>
                    <Input
                      id="assuranceContrat"
                      v-model="form.assuranceContrat"
                      placeholder="Numéro de contrat"
                    />
                  </div>
                  <div>
                    <Label for="assuranceExpiration" class="mb-3 block">Expiration assurance</Label>
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
                              : "Date d'expiration"
                          }}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="w-auto p-0">
                        <Calendar v-model="form.assuranceExpiration" />
                      </PopoverContent>
                    </Popover>
                  </div>
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
            <AccordionContent class="pt-6 px-4 pb-4 bg-muted/20 rounded-b-lg">
              <div class="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
                <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div class="flex items-center gap-2 mb-3">
                      <Checkbox id="hasGPS" v-model="form.hasGPS" />
                      <Label for="hasGPS" class="text-sm font-medium">Équipé d'un GPS</Label>
                    </div>
                  </div>
                  <div>
                    <Label for="zone" class="mb-3 block">Zone habituelle d'utilisation</Label>
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
            <AccordionContent class="pt-6 px-4 pb-4 bg-muted/20 rounded-b-lg">
              <div class="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
                <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label for="montant" class="mb-3 block">Montant journalier à verser</Label>
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
                    <Label for="joursSortie" class="mb-3 block">Jours de sortie</Label>
                    <div class="flex flex-wrap gap-2">
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
                </div>

                <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label for="heureSortie" class="mb-3 block">Heure de sortie</Label>
                    <Select v-model="form.heureSortie">
                      <SelectTrigger id="heureSortie" class="w-full">
                        <SelectValue placeholder="Heure de sortie" />
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
                    <Label for="heureEntree" class="mb-3 block">Heure d'entrée maximum</Label>
                    <Select v-model="form.heureEntree">
                      <SelectTrigger id="heureEntree" class="w-full">
                        <SelectValue placeholder="Heure d'entrée" />
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
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

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
  type GpsConfig
} from '@/config/vehiculeConfig'

// Import des icônes
import {
  CalendarIcon,
  Info,
  Settings,
  ClipboardCheck,
  MapPin,
  DollarSign,
  ImageIcon,
  X,
  Radio,
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
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    Calendar,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Textarea,
    Checkbox,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,

    // Composants personnalisés
    ColoredSelect,
    ChauffeurSelect,
    DocumentUploader,

    // Icônes
    CalendarIcon,
    Info,
    Settings,
    ClipboardCheck,
    MapPin,
    DollarSign,
    ImageIcon,
    X,
    Radio,
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
        photo: undefined // Peut être ajoutée plus tard
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

    // Documents existants (simulés - à remplacer par de vraies données)
    const existingDocuments = ref([
      { id: '1', name: 'Carte grise standard', type: 'PDF' },
      { id: '2', name: 'Contrat assurance véhicule', type: 'PDF' },
      { id: '3', name: 'Manuel utilisateur', type: 'PDF' },
      { id: '4', name: 'Certificat conformité', type: 'PDF' },
    ])

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

    // Formulaire étendu avec nouveaux champs
    const form = reactive({
      marque: '',
      modele: '',
      annee: new Date().getFullYear().toString(),
      immatriculation: '',
      type: '',
      statut: 'disponible', // Utilise les nouveaux statuts
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

    const removePhoto = (index: number) => {
      vehiclePhotos.value.splice(index, 1)
    }

    const formatDate = (date: Date) => {
      return format(date, 'dd MMMM yyyy', { locale: fr })
    }

    const submitForm = () => {
      console.log('Formulaire soumis:', form)
      console.log('Photos:', vehiclePhotos.value)
      // Ici, vous pourriez ajouter une validation de formulaire avant de soumettre
      // Puis, envoyer les données à votre API ou à votre store
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
      jours,
      heures,
      colorOptions,
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

<style scoped>
/* Styles spécifiques au modal, si nécessaire */
</style>
