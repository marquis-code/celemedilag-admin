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
          
          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Album Photos</h4>
            <div class="space-y-6">
              <div v-for="(photo, index) in form.photos" :key="index" class="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm relative">
                <div class="w-full">
                  <ImageUpload v-model="form.photos[index].url" />
                  <div class="mt-4">
                    <label class="block text-sm font-semibold mb-1.5 text-gray-700">Photo Caption</label>
                    <input v-model="form.photos[index].caption" type="text" placeholder="e.g. Youth Choir Ministration" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-royalBlue/20 focus:border-royalBlue outline-none text-sm" />
                  </div>
                </div>
                <button type="button" @click="removePhoto(index)" class="absolute -top-3 -right-3 md:relative md:top-0 md:right-0 bg-white md:bg-transparent shadow-md md:shadow-none text-red-500 hover:bg-red-50 p-2 md:p-3 rounded-full md:rounded-xl transition shrink-0 md:mt-8 z-10 border border-gray-100 md:border-transparent">
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
              <button type="button" @click="addPhoto" class="bg-blue-50 text-royalBlue font-medium text-sm hover:bg-blue-100 flex items-center px-4 py-2.5 rounded-xl transition w-full justify-center border border-blue-100">
                <Plus class="w-4 h-4 mr-2" /> Add another photo
              </button>
            </div>
          </div>

          <div class="pt-6 mt-6 border-t border-gray-100 flex justify-end space-x-3 sticky bottom-0 bg-white pb-2">
            <button type="button" @click="closeModal()" class="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" class="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-royalBlue hover:bg-skyBlue transition-colors shadow-sm disabled:opacity-50 flex items-center min-w-[140px] justify-center" :disabled="saving">
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
import { Plus, Image, Trash2, X } from 'lucide-vue-next'
import EmptyState from '~/components/EmptyState.vue'
import BaseInput from '~/components/BaseInput.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'
import ImageUpload from '~/components/ImageUpload.vue'

const { useGalleryApi } = useApi()
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

const form = ref({
  albumName: '',
  description: '',
  eventDate: '',
  location: '',
  coverImageUrl: '',
  tags: [] as string[],
  isPublished: true,
  photos: [{ url: '', caption: '' }] as any[]
})

const addPhoto = () => {
  form.value.photos.push({ url: '', caption: '' })
}

const removePhoto = (index: number) => {
  form.value.photos.splice(index, 1)
  if (form.value.photos.length === 0) {
    addPhoto()
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
      photos: album.photos && album.photos.length > 0 ? [...album.photos] : [{ url: '', caption: '' }]
    }
  } else {
    isEditing.value = false
    currentId.value = ''
    tagsInput.value = ''
    form.value = { 
      albumName: '', description: '', eventDate: new Date().toISOString().split('T')[0], 
      location: '', coverImageUrl: '', tags: [], isPublished: true, photos: [{ url: '', caption: '' }] 
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
