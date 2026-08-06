<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-800">Sermons & Resources</h2>
        <p class="text-gray-500 text-sm mt-1">Upload audio sermons, video links, and PDF materials.</p>
      </div>
      <button @click="openModal()" class="bg-royalBlue text-white px-4 py-2.5 rounded-xl font-medium hover:bg-skyBlue transition flex items-center shadow-sm">
        <Upload class="w-5 h-5 mr-2" />
        Upload Resource
      </button>
    </div>

    <!-- Filters -->
    <div class="flex space-x-4 mb-6 w-full max-w-xs">
      <BaseSelect v-model="filterType" :options="typeOptions" placeholder="All Types" />
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="p-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-royalBlue"></div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredSermons.length === 0" class="mt-8">
      <EmptyState 
        title="No Resources Found" 
        description="There are currently no sermons or resources uploaded. Start by uploading an audio message or PDF."
        actionText="Upload Resource"
        @action="openModal()"
      >
        <template #icon>
          <Headphones class="w-12 h-12 text-gray-400" />
        </template>
      </EmptyState>
    </div>

    <!-- Resources Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-colors duration-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Resource Details</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Preacher/Author</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="sermon in filteredSermons" :key="sermon._id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img v-if="sermon.coverImageUrl" :src="sermon.coverImageUrl" class="w-10 h-10 rounded-md object-cover mr-3 border border-gray-200" />
                <div v-else class="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mr-3 border border-gray-200">
                  <Headphones class="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div class="text-sm font-semibold text-gray-900">{{ sermon.title }}</div>
                  <div v-if="sermon.series" class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{{ sermon.series }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-blue-100 text-blue-800">
                {{ sermon.type }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ sermon.preacher || sermon.author || 'Unknown' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ sermon.date ? new Date(sermon.date).toLocaleDateString() : 'N/A' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openModal(sermon)" class="text-royalBlue hover:text-skyBlue mr-4 transition-colors">Edit</button>
              <button @click="confirmDelete(sermon._id)" class="text-red-500 hover:text-red-600 transition-colors">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-start justify-center z-50 transition-opacity overflow-y-auto pt-10 pb-10">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-gray-100 my-auto">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
          <h3 class="text-lg font-bold text-gray-900">{{ isEditing ? 'Edit Resource' : 'Upload Resource' }}</h3>
          <button @click="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>
        <form @submit.prevent="saveSermon" class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Basic Details</h4>
            <BaseInput v-model="form.title" label="Title *" placeholder="Resource Title" required />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseSelect v-model="form.type" label="Type" :options="formTypeOptions" placeholder="Select type" />
              <BaseInput v-model="form.preacher" label="Preacher / Author" placeholder="Name" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseInput v-model="form.date" type="date" label="Date" />
              <BaseInput v-model="form.series" label="Series" placeholder="e.g. Faith Series" />
            </div>
            <div class="w-full">
              <label class="block text-sm font-semibold mb-1.5 transition-colors text-gray-700">Summary</label>
              <textarea v-model="form.summary" rows="3" class="appearance-none block w-full px-4 py-2.5 rounded-xl border bg-white transition-all duration-200 focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue" placeholder="Brief description of the sermon..."></textarea>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Media & Links</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseInput v-model="form.fileUrl" label="Audio/PDF URL" placeholder="https://..." />
              <BaseInput v-model="form.videoUrl" label="Video URL (YouTube)" placeholder="https://youtube.com/..." />
              <ImageUpload v-model="form.coverImageUrl" label="Cover Image Upload" />
              <BaseInput v-model="form.duration" label="Duration" placeholder="e.g. 45 mins" />
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Bible Verses</h4>
            <div class="w-full">
              <label class="block text-sm font-semibold mb-1.5 transition-colors text-gray-700">Verses (comma separated)</label>
              <input v-model="versesInput" type="text" placeholder="John 3:16, Romans 8:28" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-royalBlue/20 focus:border-royalBlue outline-none" />
            </div>
          </div>

          <div class="pt-6 mt-6 border-t border-gray-100 flex justify-end space-x-3 sticky bottom-0 bg-white pb-2">
            <button type="button" @click="closeModal()" class="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" class="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-royalBlue hover:bg-skyBlue transition-colors shadow-sm disabled:opacity-50 flex items-center" :disabled="saving">
              <span v-if="saving" class="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              {{ saving ? 'Saving...' : 'Save Resource' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Delete Resource"
      message="Are you sure you want to delete this resource? This action cannot be undone."
      type="danger"
      confirmText="Delete"
      :loading="deleting"
      @confirm="executeDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Upload, Headphones, X } from 'lucide-vue-next'
import BaseSelect from '~/components/BaseSelect.vue'
import BaseInput from '~/components/BaseInput.vue'
import EmptyState from '~/components/EmptyState.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'

const filterType = ref('All')

const typeOptions = [
  { label: 'All Types', value: 'All' },
  { label: 'Audio', value: 'Audio' },
  { label: 'Video', value: 'Video' },
  { label: 'PDF', value: 'PDF' }
]

const formTypeOptions = [
  { label: 'Audio', value: 'Audio' },
  { label: 'Video', value: 'Video' },
  { label: 'PDF', value: 'PDF' }
]

const { useSermonsApi } = useApi()
const { data: sermonsRaw, pending, error, fetchAll, create, update, remove } = useSermonsApi()

onMounted(async () => {
  await fetchAll()
})

const filteredSermons = computed(() => {
  const list = sermonsRaw.value || []
  if (filterType.value === 'All') return list
  return list.filter(s => s.type === filterType.value)
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const currentId = ref('')
const versesInput = ref('')

const form = ref({
  title: '',
  type: 'Audio',
  preacher: '',
  date: '',
  fileUrl: '',
  videoUrl: '',
  duration: '',
  series: '',
  bibleVerses: [] as string[],
  summary: '',
  coverImageUrl: ''
})

const openModal = (sermon?: any) => {
  if (sermon) {
    isEditing.value = true
    currentId.value = sermon._id
    versesInput.value = sermon.bibleVerses ? sermon.bibleVerses.join(', ') : ''
    
    let formattedDate = ''
    if (sermon.date) {
      try {
        formattedDate = new Date(sermon.date).toISOString().split('T')[0]
      } catch(e) {}
    }

    form.value = {
      title: sermon.title || '',
      type: sermon.type || 'Audio',
      preacher: sermon.preacher || sermon.author || '', // fallback to author for old records
      date: formattedDate,
      fileUrl: sermon.fileUrl || '',
      videoUrl: sermon.videoUrl || '',
      duration: sermon.duration || '',
      series: sermon.series || '',
      bibleVerses: sermon.bibleVerses ? [...sermon.bibleVerses] : [],
      summary: sermon.summary || '',
      coverImageUrl: sermon.coverImageUrl || ''
    }
  } else {
    isEditing.value = false
    currentId.value = ''
    versesInput.value = ''
    form.value = { 
      title: '', type: 'Audio', preacher: '', date: '', fileUrl: '',
      videoUrl: '', duration: '', series: '', bibleVerses: [], summary: '', coverImageUrl: ''
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveSermon = async () => {
  saving.value = true
  try {
    form.value.bibleVerses = versesInput.value.split(',').map(v => v.trim()).filter(v => v)

    if (isEditing.value) {
      await update(currentId.value, form.value)
    } else {
      await create(form.value)
    }
    await fetchAll()
    closeModal()
  } catch (err) {
    console.error('Error saving sermon', err)
  } finally {
    saving.value = false
  }
}

const isDeleteModalOpen = ref(false)
const itemToDelete = ref('')
const deleting = ref(false)

const confirmDelete = (id: string) => {
  itemToDelete.value = id
  isDeleteModalOpen.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return
  deleting.value = true
  try {
    await remove(itemToDelete.value)
    await fetchAll()
    isDeleteModalOpen.value = false
  } catch (err) {
    console.error('Error deleting sermon', err)
  } finally {
    deleting.value = false
  }
}
</script>
