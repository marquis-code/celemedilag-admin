<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-display font-bold text-gray-800">Manage Events</h2>
      <button @click="openModal()" class="bg-royalBlue text-white px-4 py-2 rounded-xl font-medium hover:bg-skyBlue transition flex items-center shadow-sm">
        <Plus class="w-5 h-5 mr-2" />
        Add Event
      </button>
    </div>

    <div v-if="pending" class="p-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-royalBlue"></div>
    </div>
    
    <div v-else-if="error" class="mt-8">
      <EmptyState 
        title="Connection Error" 
        description="We couldn't load the events at this time. Please check your connection and try again."
        actionText="Try Again"
        :isError="true"
        @action="refresh()"
      />
    </div>

    <div v-else-if="!events || events.length === 0" class="mt-8">
      <EmptyState 
        title="No Events Scheduled" 
        description="There are currently no upcoming events. Create your first event to start engaging the community."
        actionText="Add Event"
        @action="openModal()"
      >
        <template #icon>
          <Calendar class="w-12 h-12 text-gray-400" />
        </template>
      </EmptyState>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-colors duration-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Details</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
            <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="event in events" :key="event._id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <img v-if="event.bannerImageUrl" :src="event.bannerImageUrl" class="w-12 h-12 rounded-lg object-cover mr-3 border border-gray-200" />
                <div v-else class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-3 border border-gray-200">
                  <Calendar class="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <div class="text-sm font-semibold text-gray-900">{{ event.title }}</div>
                  <div v-if="event.tags && event.tags.length > 0" class="flex gap-1 mt-1">
                    <span v-for="tag in event.tags.slice(0,2)" :key="tag" class="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">{{ tag }}</span>
                    <span v-if="event.tags.length > 2" class="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">+{{ event.tags.length - 2 }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md',
                event.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              ]">
                {{ event.isPublished ? (event.status || 'Published') : 'Draft' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ event.date ? new Date(event.date).toLocaleDateString() : 'TBD' }}</div>
              <div class="text-xs text-gray-500">{{ event.time || 'TBD' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ event.location || 'TBD' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openModal(event)" class="text-royalBlue hover:text-skyBlue mr-4 transition-colors">Edit</button>
              <button @click="confirmDelete(event._id)" class="text-red-500 hover:text-red-600 transition-colors">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-start justify-center z-50 transition-opacity overflow-y-auto pt-10 pb-10">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-gray-100 my-auto">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
          <h3 class="text-lg font-bold text-gray-900">{{ isEditing ? 'Edit Event' : 'Add New Event' }}</h3>
          <button @click="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>
        <form @submit.prevent="saveEvent" class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <!-- Basic Info -->
          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Basic Details</h4>
            <BaseInput v-model="form.title" label="Title *" placeholder="Event Title" required />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseInput v-model="form.date" type="date" label="Date" />
              <BaseInput v-model="form.time" type="time" label="Time" />
            </div>
            <div class="w-full">
              <label class="block text-sm font-semibold mb-1.5 transition-colors text-gray-700">Description</label>
              <textarea v-model="form.description" rows="3" class="appearance-none block w-full px-4 py-2.5 rounded-xl border bg-white transition-all duration-200 focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue" placeholder="Event description..."></textarea>
            </div>
          </div>

          <!-- Location & Media -->
          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Location & Media</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseInput v-model="form.location" label="Location" placeholder="Physical address or Zoom link" />
              <BaseInput v-model="form.mapUrl" label="Google Maps URL" placeholder="https://maps.google.com/..." />
              <ImageUpload v-model="form.bannerImageUrl" label="Banner Image Upload" />
              <BaseInput v-model="form.registrationUrl" label="Registration URL" placeholder="Link to register" />
            </div>
          </div>

          <!-- Status & Tags -->
          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Settings & Tags</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseSelect
                v-model="form.status"
                label="Status"
                :options="[
                  { label: 'Upcoming', value: 'Upcoming' },
                  { label: 'Ongoing', value: 'Ongoing' },
                  { label: 'Completed', value: 'Completed' }
                ]"
                placeholder="Select status"
              />
              <div>
                <label class="block text-sm font-semibold mb-1.5 text-gray-700">Tags (comma separated)</label>
                <input v-model="tagsInput" type="text" placeholder="Worship, Seminar, Retreat" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-royalBlue/20 focus:border-royalBlue outline-none" />
              </div>
              <div class="flex items-center space-x-2 mt-2">
                <input type="checkbox" id="isPublished" v-model="form.isPublished" class="rounded border-gray-300 text-royalBlue focus:ring-royalBlue" />
                <label for="isPublished" class="text-sm font-medium text-gray-700">Published (Visible to public)</label>
              </div>
            </div>
          </div>

          <!-- Speakers -->
          <div class="space-y-4">
            <div class="flex justify-between items-center border-b pb-2">
              <h4 class="font-semibold text-gray-700">Speakers / Guests</h4>
              <button type="button" @click="addSpeaker" class="text-sm text-royalBlue hover:text-skyBlue font-medium flex items-center">
                <Plus class="w-4 h-4 mr-1" /> Add Speaker
              </button>
            </div>
            
            <div v-if="form.speakers.length === 0" class="text-sm text-gray-500 italic py-2">
              No speakers added yet.
            </div>
            
            <div v-for="(speaker, index) in form.speakers" :key="index" class="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
              <button type="button" @click="removeSpeaker(index)" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition">
                <X class="w-4 h-4" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput v-model="speaker.name" label="Name" placeholder="Speaker Name" />
                <BaseInput v-model="speaker.role" label="Role" placeholder="e.g. Guest Minister" />
                <ImageUpload v-model="speaker.photoUrl" label="Photo Upload" />
                <BaseInput v-model="speaker.bio" label="Short Bio" placeholder="Brief description..." />
              </div>
            </div>
          </div>

          <div class="pt-6 mt-6 border-t border-gray-100 flex justify-end space-x-3 sticky bottom-0 bg-white pb-2">
            <button type="button" @click="closeModal()" class="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" class="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-royalBlue hover:bg-skyBlue transition-colors shadow-sm disabled:opacity-50 flex items-center" :disabled="saving">
              <span v-if="saving" class="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              {{ saving ? 'Saving...' : 'Save Event' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Delete Event"
      message="Are you sure you want to delete this event? This action cannot be undone."
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
import { Plus, X, Calendar } from 'lucide-vue-next'
import BaseInput from '~/components/BaseInput.vue'
import EmptyState from '~/components/EmptyState.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'

const { useEventsApi } = useApi()
const { data: events, pending, error, fetchAll, create, update, remove } = useEventsApi()
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
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
  mapUrl: '',
  bannerImageUrl: '',
  speakers: [] as any[],
  tags: [] as string[],
  registrationUrl: '',
  isPublished: true,
  status: ''
})

const addSpeaker = () => {
  form.value.speakers.push({ name: '', role: '', photoUrl: '', bio: '' })
}

const removeSpeaker = (index: number) => {
  form.value.speakers.splice(index, 1)
}

const openModal = (event?: any) => {
  if (event) {
    isEditing.value = true
    currentId.value = event._id
    tagsInput.value = event.tags ? event.tags.join(', ') : ''
    
    // Convert date for date input
    let formattedDate = ''
    if (event.date) {
      try {
        formattedDate = new Date(event.date).toISOString().split('T')[0]
      } catch(e) {}
    }
    
    form.value = {
      title: event.title || '',
      date: formattedDate,
      time: event.time || '',
      location: event.location || '',
      description: event.description || '',
      mapUrl: event.mapUrl || '',
      bannerImageUrl: event.bannerImageUrl || '',
      speakers: event.speakers ? JSON.parse(JSON.stringify(event.speakers)) : [],
      tags: event.tags ? [...event.tags] : [],
      registrationUrl: event.registrationUrl || '',
      isPublished: event.isPublished !== false,
      status: event.status || ''
    }
  } else {
    isEditing.value = false
    currentId.value = ''
    tagsInput.value = ''
    form.value = { 
      title: '', date: '', time: '', location: '', description: '',
      mapUrl: '', bannerImageUrl: '', speakers: [], tags: [],
      registrationUrl: '', isPublished: true, status: ''
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveEvent = async () => {
  saving.value = true
  try {
    // Process tags
    form.value.tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t)
    
    if (isEditing.value) {
      await update(currentId.value, form.value)
    } else {
      await create(form.value)
    }
    await fetchAll()
    closeModal()
  } catch (e) {
    console.error('Error saving event', e)
    showToast('Failed to save event', 'error')
  } finally {
    saving.value = false
  }
}

const isDeleteModalOpen = ref(false)
const eventToDelete = ref('')
const deleting = ref(false)

const confirmDelete = (id: string) => {
  eventToDelete.value = id
  isDeleteModalOpen.value = true
}

const executeDelete = async () => {
  if (!eventToDelete.value) return
  deleting.value = true
  try {
    await remove(eventToDelete.value)
    await fetchAll()
    isDeleteModalOpen.value = false
  } catch (e) {
    console.error('Error deleting event', e)
    showToast('Failed to delete event', 'error')
  } finally {
    deleting.value = false
  }
}
</script>
