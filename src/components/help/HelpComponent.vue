<template>
  <div class="space-y-8 min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-8">
    <!-- En-tête avec titre et description -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Centre d'aide</h1>
        <p class="text-muted-foreground">
          Trouvez des réponses à vos questions et apprenez à utiliser toutes les fonctionnalités de
          la plateforme.
        </p>
      </div>
    </div>

    <!-- Contenu principal -->
    <Card>
      <CardHeader>
        <CardTitle>Aide et support</CardTitle>
        <CardDescription>
          Consultez notre documentation ou contactez notre équipe de support
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="faq" class="w-full">
          <TabsList class="w-full md:w-auto flex md:inline-flex overflow-x-auto">
            <TabsTrigger value="faq">Foire aux questions</TabsTrigger>
            <TabsTrigger value="tutoriels">Tutoriels</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" class="space-y-4">
            <Accordion type="single" collapsible class="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Comment ajouter un nouveau véhicule ?</AccordionTrigger>
                <AccordionContent>
                  Pour ajouter un nouveau véhicule, allez dans la section "Véhicules" puis cliquez
                  sur le bouton "+ Ajouter un véhicule". Remplissez le formulaire avec les
                  informations requises et cliquez sur "Enregistrer".
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Comment enregistrer une recette ?</AccordionTrigger>
                <AccordionContent>
                  Pour enregistrer une recette, accédez à la section "Recettes" et cliquez sur
                  "Nouvelle recette". Sélectionnez le véhicule concerné, la date, le montant et les
                  autres détails nécessaires.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Comment consulter l'historique des opérations ?</AccordionTrigger>
                <AccordionContent>
                  L'historique des opérations est disponible dans la section "Historique générale"
                  accessible depuis le menu principal. Vous pouvez filtrer par date, type
                  d'opération ou entité concernée.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Comment récupérer un élément supprimé ?</AccordionTrigger>
                <AccordionContent>
                  Les éléments supprimés sont conservés pendant 30 jours dans la "Corbeille". Pour
                  restaurer un élément, accédez à la corbeille, trouvez l'élément concerné et
                  cliquez sur le bouton "Restaurer".
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="tutoriels">
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Premiers pas avec l'application</CardTitle>
                  <CardDescription>Découvrez les fonctionnalités de base</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Ce tutoriel vous guide à travers les premières étapes pour configurer votre
                    compte et commencer à utiliser l'application.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" class="w-full">Voir le tutoriel</Button>
                </CardFooter>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Gestion de flotte avancée</CardTitle>
                  <CardDescription>Optimisez la gestion de vos véhicules</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Apprenez à gérer efficacement votre flotte, suivre les entretiens et analyser
                    les performances de vos véhicules.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" class="w-full">Voir le tutoriel</Button>
                </CardFooter>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Rapports et analyses</CardTitle>
                  <CardDescription>Créez des tableaux de bord personnalisés</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Découvrez comment générer des rapports détaillés et créer des tableaux de bord
                    pour suivre les performances de votre flotte.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" class="w-full">Voir le tutoriel</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documentation">
            <div class="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Documentation technique</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul class="space-y-2">
                    <li>
                      <a href="#" class="text-primary hover:underline flex items-center">
                        <FileText class="h-4 w-4 mr-2" />
                        Guide de l'API
                      </a>
                    </li>
                    <li>
                      <a href="#" class="text-primary hover:underline flex items-center">
                        <FileText class="h-4 w-4 mr-2" />
                        Documentation de référence
                      </a>
                    </li>
                    <li>
                      <a href="#" class="text-primary hover:underline flex items-center">
                        <FileText class="h-4 w-4 mr-2" />
                        Exigences système
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Guides utilisateur</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul class="space-y-2">
                    <li>
                      <a href="#" class="text-primary hover:underline flex items-center">
                        <BookOpen class="h-4 w-4 mr-2" />
                        Guide de démarrage rapide
                      </a>
                    </li>
                    <li>
                      <a href="#" class="text-primary hover:underline flex items-center">
                        <BookOpen class="h-4 w-4 mr-2" />
                        Manuel utilisateur complet
                      </a>
                    </li>
                    <li>
                      <a href="#" class="text-primary hover:underline flex items-center">
                        <BookOpen class="h-4 w-4 mr-2" />
                        Configuration avancée
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contactez notre équipe de support</CardTitle>
                <CardDescription>
                  Nous sommes là pour vous aider. Remplissez le formulaire ci-dessous et nous vous
                  répondrons dans les plus brefs délais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form class="space-y-4">
                  <div class="grid gap-4 md:grid-cols-2">
                    <div class="space-y-2">
                      <Label for="name">Nom complet</Label>
                      <Input id="name" placeholder="Votre nom" />
                    </div>
                    <div class="space-y-2">
                      <Label for="email">Email</Label>
                      <Input id="email" type="email" placeholder="votre@email.com" />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <Label for="subject">Sujet</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un sujet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Sujets</SelectLabel>
                          <SelectItem value="technical">Problème technique</SelectItem>
                          <SelectItem value="billing">Facturation</SelectItem>
                          <SelectItem value="feature">Demande de fonctionnalité</SelectItem>
                          <SelectItem value="other">Autre demande</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="space-y-2">
                    <Label for="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Décrivez votre problème en détail..."
                      rows="5"
                    />
                  </div>

                  <div class="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label
                      for="terms"
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      J'accepte la politique de confidentialité
                    </label>
                  </div>

                  <Button type="submit" class="w-full">Envoyer le message</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { BookOpen, FileText } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export default defineComponent({
  name: 'AideComponent',
  components: {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Button,
    Input,
    Label,
    Textarea,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    Checkbox,
    BookOpen,
    FileText,
  },
})
</script>

<style scoped>
/* Styles spécifiques au composant */
</style>
