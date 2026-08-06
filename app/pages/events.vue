<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-display font-bold text-gray-800">Manage Events</h2>
      <button @click="openModal()" class="bg-royalBlue text-white px-4 py-2 rounded-lg font-medium hover:bg-skyBlue transition flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Add Event
      </button>
    </div>

    <!-- Events List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="pending" class="p-6 text-gray-500 text-center">Loading events...</div>
      <div v-else-if="error" class="p-6 text-red-500 text-center">Failed to load events.</div>
      <div v-else-if="events && events.length === 0" class="p-6 text-gray-500 text-center">No events found.</div>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="event in events" :key="event._id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ event.title }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ new Date(event.date).toLocaleDateString() }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ event.location }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openModal(event)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
              <button @click="deleteEvent(event._id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-900">{{ isEditing ? 'Edit Event' : 'Add New Event' }}</h3>
          <button @click="closeModal()" class="text-gray-400 hover:text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <form @submit.prevent="saveEvent" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
            <input v-model="form.title" type="text" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input v-model="form.date" type="datetime-local" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input v-model="form.location" type="text" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="form.description" required rows="3" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue"></textarea>
          </div>
          <div class="pt-4 flex justify-end space-x-3">
            <button type="button" @click="closeModal()" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
            <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royalBlue hover:bg-skyBlue" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Event' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const { data: events, pending, error, refresh } = await useFetch<any[]>('http://localhost:3001/api/events')

const isModalOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const currentId = ref('')

const form = ref({
  title: '',
  date: '',
  location: '',
  description: ''
})

const openModal = (event?: any) => {
  if (event) {
    isEditing.value = true
    currentId.value = event._id
    // Format date for datetime-local input
    const d = new Date(event.date)
    const formattedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0,16)
    
    form.value = {
      title: event.title,
      date: formattedDate,
      location: event.location,
      description: event.description
    }
  } else {
    isEditing.value = false
    currentId.value = ''
    form.value = { title: '', date: '', location: '', description: '' }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveEvent = async () => {
  saving.value = true
  try {
    const url = isEditing.value 
      ? `http://localhost:3001/api/events/${currentId.value}`
      : 'http://localhost:3001/api/events'
      
    const method = isEditing.value ? 'PATCH' : 'POST'

    await $fetch(url, {
      method,
      body: form.value
    })
    
    await refresh()
    closeModal()
  } catch (e) {
    console.error('Error saving event', e)
    alert('Failed to save event')
  } finally {
    saving.value = false
  }
}

const deleteEvent = async (id: string) => {
  if (!confirm('Are you sure you want to delete this event?')) return
  
  try {
    await $fetch(`http://localhost:3001/api/events/${id}`, {
      method: 'DELETE'
    })
    await refresh()
  } catch (e) {
    console.error('Error deleting event', e)
    alert('Failed to delete event')
  }
}
</script>
