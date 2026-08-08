<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-800">Gallery Management</h2>
        <p class="text-gray-500 text-sm mt-1">Upload and organize photos into albums.</p>
      </div>
      <button @click="openModal()" class="bg-royalBlue text-white px-4 py-2.5 rounded-xl font-medium hover:bg-skyBlue transition flex items-center shadow-sm">
        <Plus class="w-5 h-5 mr-2" />
        Create Album
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="!pending && (!albums || albums.length === 0)" class="mt-8">
      <EmptyState 
        title="No Albums Found" 
        description="There are currently no photo albums in the gallery. Create your first album to start uploading photos."
        actionText="Create Album"
        @action="openModal()"
      >
        <template #icon>
          <Image class="w-12 h-12 text-gray-400" />
        </template>
      </EmptyState>
    </div>

    <div v-else-if="pending" class="p-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-royalBlue"></div>
    </div>

    <!-- Gallery Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="album in albums" :key="album._id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:border-royalBlue transition-all duration-200 group">
        <div class="h-48 bg-gray-200 relative overflow-hidden" @click="openModal(album)">
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <span class="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">Edit Album</span>
          </div>
          <div v-if="album.coverImageUrl || (album.photos && album.photos.length > 0)" class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" :style="`background-image: url(${album.coverImageUrl || album.photos[0]?.url})`"></div>
          <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
            <Image class="w-12 h-12" />
          </div>
          
          <div class="absolute top-2 right-2 z-10">
             <span :class="['px-2 py-1 text-xs font-bold rounded shadow-sm', album.isPublished ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white']">
               {{ album.isPublished ? 'Live' : 'Draft' }}
             </span>
          </div>
        </div>
        <div class="p-5 flex justify-between items-center">
          <div class="overflow-hidden pr-2">
            <h3 class="font-bold text-gray-800 truncate">{{ album.albumName }}</h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ album.photos ? album.photos.length : 0 }} Photos</p>
          </div>
          <button @click.stop="confirmDelete(album)" class="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-2 rounded-lg hover:bg-red-50">
            <Trash2 class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-start justify-center z-50 transition-opacity overflow-y-auto pt-10 pb-10">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-100 my-auto">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
          <h3 class="text-lg font-bold text-gray-900">{{ isEditing ? 'Edit Album' : 'Create Album' }}</h3>
          <button @click="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>
        <form @submit.prevent="saveAlbum" class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <div class="space-y-4">
             <h4 class="font-semibold text-gray-700 border-b pb-2">Album Details</h4>
             <BaseInput v-model="form.albumName" label="Album Title *" placeholder="e.g. Sunday Service" required />
             <div class="w-full">
               <label class="block text-sm font-semibold mb-1.5 transition-colors text-gray-700">Description</label>
               <textarea v-model="form.description" rows="2" class="appearance-none block w-full px-4 py-2.5 rounded-xl border bg-white transition-all duration-200 focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue" placeholder="Brief description of the album..."></textarea>
             </div>
             
             <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
               <BaseInput v-model="form.eventDate" type="date" label="Event Date" />
               <BaseInput v-model="form.location" label="Location" placeholder="e.g. Main Auditorium" />
             </div>
             
             <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
               <ImageUpload v-model="form.coverImageUrl" label="Cover Image Upload" />
               <div>
                 <label class="block text-sm font-semibold mb-1.5 text-gray-700">Tags (comma separated)</label>
                 <input v-model="tagsInput" type="text" placeholder="Service, Choir, Youth" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-royalBlue/20 focus:border-royalBlue outline-none" />
               </div>
             </div>
             
             <div class="flex items-center mt-2">
               <input type="checkbox" id="isPublished" v-model="form.isPublished" class="rounded border-gray-300 text-royalBlue focus:ring-royalBlue w-5 h-5" />
               <label for="isPublished" class="text-sm font-medium text-gray-700 ml-2">Publish Album</label>
             </div>
          </div>
          
          <!-- ========== BULK UPLOAD SECTION ========== -->
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b pb-2">
              <h4 class="font-semibold text-gray-700">Album Photos</h4>
              <span class="text-xs text-gray-400 font-medium">{{ form.photos.filter(p => p.url).length }} photo(s)</span>
            </div>

            <!-- Drag & Drop Upload Zone -->
            <div
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              :class="[
                'relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer',
                isDragging ? 'border-royalBlue bg-blue-50 scale-[1.01]' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50',
                bulkUploading ? 'pointer-events-none' : ''
              ]"
            >
              <input
                ref="bulkFileInput"
                type="file"
                accept="image/*"
                multiple
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                @change="handleBulkFileSelect"
                :disabled="bulkUploading"
              />
              <div class="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors', isDragging ? 'bg-royalBlue text-white' : 'bg-blue-100 text-royalBlue']">
                  <UploadCloud class="w-7 h-7" />
                </div>
                <p class="text-sm font-semibold text-gray-700">
                  <span v-if="isDragging">Drop images here</span>
                  <span v-else>Drag & drop images here, or <span class="text-royalBlue">browse</span></span>
                </p>
                <p class="text-xs text-gray-400 mt-1">Select multiple images at once · JPG, PNG, GIF · Up to 50 files</p>
              </div>
            </div>

            <!-- Bulk Upload Progress -->
            <div v-if="bulkUploading" class="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="animate-spin w-4 h-4 border-2 border-royalBlue border-t-transparent rounded-full"></div>
                  <span class="text-sm font-semibold text-royalBlue">Uploading {{ bulkUploadQueue.length }} image(s)...</span>
                </div>
                <span class="text-xs font-bold text-royalBlue bg-blue-100 px-2 py-1 rounded-full">{{ bulkUploadProgress }}%</span>
              </div>
              <!-- Progress bar -->
              <div class="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                <div class="h-full bg-royalBlue rounded-full transition-all duration-500 ease-out" :style="{ width: bulkUploadProgress + '%' }"></div>
              </div>
              <!-- Per-file status -->
              <div class="max-h-32 overflow-y-auto space-y-1">
                <div v-for="(item, idx) in bulkUploadQueue" :key="idx" class="flex items-center gap-2 text-xs">
                  <CheckCircle v-if="item.status === 'done'" class="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <XCircle v-else-if="item.status === 'error'" class="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <div v-else class="w-3.5 h-3.5 border-2 border-gray-300 border-t-royalBlue rounded-full animate-spin shrink-0"></div>
                  <span :class="[item.status === 'error' ? 'text-red-600' : 'text-gray-600']" class="truncate">{{ item.name }}</span>
                </div>
              </div>
            </div>

            <!-- Uploaded Photos Grid -->
            <div v-if="form.photos.some(p => p.url)" class="space-y-3">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div
                  v-for="(photo, index) in form.photos"
                  :key="index"
                  v-show="photo.url"
                  class="group relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-royalBlue/30 transition-all duration-200"
                >
                  <!-- Photo thumbnail -->
                  <div class="aspect-square bg-gray-100 overflow-hidden">
                    <img :src="photo.url" alt="" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <!-- Overlay controls -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      @click="removePhoto(index)"
                      class="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-lg shadow-lg transition-colors backdrop-blur-sm"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <!-- Caption input -->
                  <div class="p-2">
                    <input
                      v-model="photo.caption"
                      type="text"
                      placeholder="Add caption..."
                      class="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-100 bg-gray-50 focus:ring-1 focus:ring-royalBlue/30 focus:border-royalBlue outline-none placeholder-gray-400 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Legacy single-add fallback (for adding individual photos via existing ImageUpload) -->
            <div class="flex gap-2">
              <button type="button" @click="addPhoto" class="bg-blue-50 text-royalBlue font-medium text-sm hover:bg-blue-100 flex items-center px-4 py-2.5 rounded-xl transition flex-1 justify-center border border-blue-100">
                <Plus class="w-4 h-4 mr-2" /> Add single photo
              </button>
            </div>

            <!-- Single photo add slots (only visible when there are empty slots) -->
            <div v-for="(photo, index) in form.photos" :key="'single-' + index" v-show="!photo.url" class="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm relative">
              <div class="flex items-start gap-3">
                <div class="flex-1">
                  <ImageUpload v-model="form.photos[index].url" />
                  <div class="mt-3">
                    <input v-model="form.photos[index].caption" type="text" placeholder="Photo caption (optional)" class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-royalBlue/20 focus:border-royalBlue outline-none text-sm" />
                  </div>
                </div>
                <button type="button" @click="removePhoto(index)" class="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition shrink-0 mt-1">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div class="pt-6 mt-6 border-t border-gray-100 flex justify-end space-x-3 sticky bottom-0 bg-white pb-2">
            <button type="button" @click="closeModal()" class="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" class="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-royalBlue hover:bg-skyBlue transition-colors shadow-sm disabled:opacity-50 flex items-center min-w-[140px] justify-center" :disabled="saving || bulkUploading">
              <span v-if="saving" class="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              {{ saving ? 'Saving...' : 'Save Album' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Delete Album"
      message="Are you sure you want to delete this album? This action cannot be undone."
      type="danger"
      confirmText="Delete"
      :loading="deleting"
      @confirm="executeDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Image, Trash2, X, UploadCloud, CheckCircle, XCircle } from 'lucide-vue-next'
import EmptyState from '~/components/EmptyState.vue'
import BaseInput from '~/components/BaseInput.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'
import ImageUpload from '~/components/ImageUpload.vue'

const { useGalleryApi, apiClient } = useApi()
const { data: albums, pending, error, fetchAll, create, update, remove } = useGalleryApi()
const { showToast } = useToast()

onMounted(async () => {
  await fetchAll()
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const currentId = ref('')
const tagsInput = ref('')

// Bulk upload state
const bulkFileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const bulkUploading = ref(false)
const bulkUploadProgress = ref(0)
const bulkUploadQueue = ref<{ name: string; status: 'pending' | 'uploading' | 'done' | 'error' }[]>([])

const form = ref({
  albumName: '',
  description: '',
  eventDate: '',
  location: '',
  coverImageUrl: '',
  tags: [] as string[],
  isPublished: true,
  photos: [] as { url: string; caption: string }[]
})

const addPhoto = () => {
  form.value.photos.push({ url: '', caption: '' })
}

const removePhoto = (index: number) => {
  form.value.photos.splice(index, 1)
}

// ---- BULK UPLOAD LOGIC ----
const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    executeBulkUpload(files)
  }
}

const handleBulkFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    executeBulkUpload(target.files)
  }
  // Reset input so same files can be re-selected
  target.value = ''
}

const executeBulkUpload = async (files: FileList) => {
  // Filter to only image files
  const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
  if (imageFiles.length === 0) {
    showToast('No valid image files selected.', 'error')
    return
  }

  bulkUploading.value = true
  bulkUploadProgress.value = 0
  bulkUploadQueue.value = imageFiles.map(f => ({ name: f.name, status: 'pending' as const }))

  // Build FormData with all files
  const formData = new FormData()
  imageFiles.forEach(file => {
    formData.append('files', file)
  })

  // Mark all as uploading
  bulkUploadQueue.value.forEach(item => { item.status = 'uploading' })

  try {
    const response = await apiClient.post('/upload/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.total) {
          bulkUploadProgress.value = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        }
      }
    })

    const result = response.data?.data || response.data

    // Process successful uploads
    if (result.uploaded && result.uploaded.length > 0) {
      result.uploaded.forEach((item: any) => {
        // Add to form photos
        form.value.photos.push({ url: item.url, caption: '' })
        // Mark in queue
        const queueItem = bulkUploadQueue.value.find(q => q.name === item.originalName)
        if (queueItem) queueItem.status = 'done'
      })
    }

    // Process failures
    if (result.failed && result.failed.length > 0) {
      result.failed.forEach((item: any) => {
        const queueItem = bulkUploadQueue.value.find(q => q.name === item.originalName)
        if (queueItem) queueItem.status = 'error'
      })
    }

    // Mark any remaining as done (fallback)
    bulkUploadQueue.value.forEach(item => {
      if (item.status === 'uploading') item.status = 'done'
    })

    bulkUploadProgress.value = 100

    const successCount = result.successCount || 0
    const failedCount = result.failedCount || 0

    if (failedCount > 0) {
      showToast(`${successCount} image(s) uploaded, ${failedCount} failed.`, 'warning')
    } else {
      showToast(`${successCount} image(s) uploaded successfully!`, 'success')
    }
  } catch (err: any) {
    console.error('Bulk upload failed:', err)
    bulkUploadQueue.value.forEach(item => { item.status = 'error' })
    showToast('Bulk upload failed. Please try again.', 'error')
  } finally {
    // Small delay before clearing upload state so user sees final status
    setTimeout(() => {
      bulkUploading.value = false
      bulkUploadQueue.value = []
      bulkUploadProgress.value = 0
    }, 1500)
  }
}

const openModal = (album?: any) => {
  if (album) {
    isEditing.value = true
    currentId.value = album._id
    tagsInput.value = album.tags ? album.tags.join(', ') : ''
    
    let formattedDate = ''
    if (album.eventDate) {
      try {
        formattedDate = new Date(album.eventDate).toISOString().split('T')[0]
      } catch(e) {}
    }

    form.value = {
      albumName: album.albumName || '',
      description: album.description || '',
      eventDate: formattedDate,
      location: album.location || '',
      coverImageUrl: album.coverImageUrl || '',
      tags: album.tags ? [...album.tags] : [],
      isPublished: album.isPublished !== false,
      photos: album.photos && album.photos.length > 0 ? [...album.photos] : []
    }
  } else {
    isEditing.value = false
    currentId.value = ''
    tagsInput.value = ''
    form.value = { 
      albumName: '', description: '', eventDate: new Date().toISOString().split('T')[0], 
      location: '', coverImageUrl: '', tags: [], isPublished: true, photos: [] 
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveAlbum = async () => {
  saving.value = true
  try {
    form.value.tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t)
    
    // Filter out empty photos
    const cleanedPhotos = form.value.photos.filter(p => p && p.url && p.url.trim() !== '')
    const payload = { ...form.value, photos: cleanedPhotos }

    if (isEditing.value) {
      await update(currentId.value, payload)
    } else {
      await create(payload)
    }
    await fetchAll()
    closeModal()
    showToast(`Album ${isEditing.value ? 'updated' : 'created'} successfully!`, 'success')
  } catch (err) {
    console.error('Failed to save album', err)
    showToast('Failed to save album. Please try again.', 'error')
  } finally {
    saving.value = false
  }
}

// Delete Logic
const isDeleteModalOpen = ref(false)
const itemToDelete = ref('')
const deleting = ref(false)

const confirmDelete = (album: any) => {
  itemToDelete.value = album._id
  isDeleteModalOpen.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return
  deleting.value = true
  try {
    await remove(itemToDelete.value)
    await fetchAll()
    isDeleteModalOpen.value = false
    itemToDelete.value = ''
  } catch (err) {
    console.error('Failed to delete album', err)
    showToast('Failed to delete album. Please try again.', 'error')
  } finally {
    deleting.value = false
  }
}
</script>

