<template>
  <div class="space-y-4">
    <Label class="text-base font-semibold block">Documents du véhicule</Label>

    <!-- Zone d'upload de nouveaux documents -->
    <div class="space-y-3">
      <Label class="text-sm font-medium">Ajouter de nouveaux documents</Label>
      <div
        class="relative h-24 w-full rounded-md border-2 border-dashed border-muted-foreground/50 flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
        @click="uploadDocuments"
      >
        <div class="text-center p-3">
          <FileText class="h-6 w-6 mx-auto text-muted-foreground mb-1" />
          <p class="text-xs text-muted-foreground">Cliquez pour ajouter des documents</p>
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
            <span class="text-xs text-muted-foreground">({{ formatFileSize(doc.size) }})</span>
          </div>
          <Button type="button" variant="ghost" size="sm" @click="removeDocument(index)">
            <X class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Sélection de documents existants -->
    <div class="space-y-3">
      <Label class="text-sm font-medium">Lier des documents existants</Label>
      <Select v-model="selectedExistingDoc" @update:model-value="addExistingDocument">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Choisir dans les documents existants" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="doc in existingDocuments" :key="doc.id" :value="doc.id">
            <div class="flex items-center gap-2">
              <FileText class="h-4 w-4" />
              <span>{{ doc.name }}</span>
              <span class="text-xs text-muted-foreground">({{ doc.type }})</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Documents liés -->
    <div v-if="linkedDocuments.length > 0" class="space-y-2">
      <Label class="text-sm font-medium">Documents liés</Label>
      <div class="space-y-2">
        <div
          v-for="(doc, index) in linkedDocuments"
          :key="index"
          class="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-md"
        >
          <div class="flex items-center gap-2">
            <div class="p-1 rounded bg-blue-100">
              <FileText class="h-4 w-4 text-blue-600" />
            </div>
            <span class="text-sm font-medium">{{ doc.name }}</span>
            <span class="text-xs text-blue-600">(Existant)</span>
          </div>
          <Button type="button" variant="ghost" size="sm" @click="removeLinkedDocument(index)">
            <X class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, X } from 'lucide-vue-next'

interface Document {
  id?: string
  name: string
  type?: string
  size?: number
  file?: File
}

interface Props {
  existingDocuments?: Document[]
}

const props = withDefaults(defineProps<Props>(), {
  existingDocuments: () => [],
})

const documentsInput = ref<HTMLInputElement | null>(null)
const uploadedDocuments = ref<File[]>([])
const linkedDocuments = ref<Document[]>([])
const selectedExistingDoc = ref<string>('')

const uploadDocuments = () => {
  if (documentsInput.value) {
    documentsInput.value.click()
  }
}

const onDocumentsSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const files = Array.from(input.files)
    uploadedDocuments.value.push(...files)
  }
}

const removeDocument = (index: number) => {
  uploadedDocuments.value.splice(index, 1)
}

const addExistingDocument = (docId: string) => {
  if (!docId) return

  const doc = props.existingDocuments.find((d) => d.id === docId)
  if (doc && !linkedDocuments.value.find((d) => d.id === docId)) {
    linkedDocuments.value.push(doc)
  }
  selectedExistingDoc.value = ''
}

const removeLinkedDocument = (index: number) => {
  linkedDocuments.value.splice(index, 1)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

defineExpose({
  uploadedDocuments,
  linkedDocuments,
})
</script>
