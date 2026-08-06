<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-800">Alumni Directory</h2>
        <p class="text-gray-500 text-sm">Manage registered alumni and their details.</p>
      </div>
      <button @click="openModal()" class="bg-royalBlue text-white px-4 py-2 rounded-lg font-medium hover:bg-skyBlue transition flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Add Alumnus
      </button>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-if="!pending && (!alumni || alumni.length === 0)"
      icon="Users"
      title="No alumni found"
      description="Get started by adding your first alumnus to the directory."
      actionLabel="Add Alumnus"
      @action="openModal()"
    />
    
    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="pending" class="p-12 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-royalBlue"></div>
      </div>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alumnus</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Graduation</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profession & Location</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="alumnus in alumni" :key="alumnus._id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img v-if="alumnus.photoUrl" :src="alumnus.photoUrl" class="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200" />
                <div v-else class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 border border-gray-200">
                  <span class="text-blue-600 font-bold text-sm">{{ alumnus.name.charAt(0) }}</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ alumnus.name }}</div>
                  <div class="text-xs text-gray-500">{{ alumnus.email }}</div>
                  <div v-if="alumnus.wasExco" class="text-[10px] text-royalBlue font-bold mt-0.5">{{ alumnus.excoRole || 'Exco Member' }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">Class of {{ alumnus.graduationYear || 'Unknown' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ alumnus.profession || 'N/A' }}</div>
              <div class="text-xs text-gray-500">{{ alumnus.currentCompany ? alumnus.currentCompany + ' • ' : '' }}{{ alumnus.location || 'Unknown' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openModal(alumnus)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
              <button @click="confirmDelete(alumnus)" class="text-red-600 hover:text-red-900">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto pt-10 pb-10">
      <div class="bg-white rounded-xl shadow-lg max-w-3xl w-full my-auto">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-xl">
          <h3 class="text-xl font-display font-bold text-gray-800">{{ isEditing ? 'Edit Alumnus' : 'Add Alumnus' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <form @submit.prevent="saveAlumnus" class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Personal Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseInput v-model="form.name" label="Full Name *" placeholder="e.g. Dr. Sarah Cole" required />
              <BaseInput v-model="form.graduationYear" label="Graduation Year" placeholder="e.g. 2020" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseInput v-model="form.email" type="email" label="Email Address" placeholder="e.g. sarah@example.com" />
              <BaseInput v-model="form.phone" type="tel" label="Phone Number" placeholder="+234..." />
            </div>
            <div class="w-full">
              <label class="block text-sm font-semibold mb-1.5 transition-colors text-gray-700">Short Bio</label>
              <textarea v-model="form.bio" rows="2" class="appearance-none block w-full px-4 py-2.5 rounded-xl border bg-white transition-all duration-200 focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue" placeholder="Brief biography..."></textarea>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Professional & Links</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseInput v-model="form.profession" label="Profession" placeholder="e.g. Pediatrician" />
              <BaseInput v-model="form.currentCompany" label="Current Company / Hospital" placeholder="e.g. LUTH" />
              <BaseInput v-model="form.location" label="Location" placeholder="e.g. Lagos, Nigeria" />
              <BaseInput v-model="form.linkedInProfile" label="LinkedIn URL" placeholder="https://linkedin.com/in/..." />
              <ImageUpload v-model="form.photoUrl" label="Profile Photo Upload" class="md:col-span-2" />
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Fellowship History</h4>
            <div class="flex items-center space-x-2">
              <input type="checkbox" id="wasExco" v-model="form.wasExco" class="rounded border-gray-300 text-royalBlue focus:ring-royalBlue w-5 h-5" />
              <label for="wasExco" class="text-sm font-medium text-gray-700">Was an Executive Member</label>
            </div>
            <div v-if="form.wasExco">
              <BaseInput v-model="form.excoRole" label="Executive Role" placeholder="e.g. President, Prayer Secretary" />
            </div>
          </div>
          
          <div class="pt-6 mt-6 border-t border-gray-100 flex justify-end space-x-3 sticky bottom-0 bg-white pb-2">
            <button type="button" @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" :disabled="isSaving" class="px-4 py-2 bg-royalBlue text-white rounded-lg hover:bg-skyBlue font-medium transition flex items-center justify-center min-w-[120px]">
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSaving ? 'Saving...' : 'Save Alumnus' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmModal 
      :isOpen="isDeleteModalOpen"
      title="Delete Alumnus"
      message="Are you sure you want to remove this alumnus? This action cannot be undone."
      confirmText="Yes, delete alumnus"
      :loading="isDeleting"
      @confirm="deleteAlumnus"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseInput from '~/components/BaseInput.vue'
import EmptyState from '~/components/EmptyState.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'

const { useAlumniApi } = useApi()
const { data: alumni, pending, error, fetchAll, create, update, remove } = useAlumniApi()

onMounted(async () => {
  await fetchAll()
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const isDeleteModalOpen = ref(false)
const alumnusToDelete = ref<any>(null)

const form = ref({
  _id: '',
  name: '',
  email: '',
  graduationYear: '',
  profession: '',
  location: '',
  phone: '',
  linkedInProfile: '',
  bio: '',
  photoUrl: '',
  currentCompany: '',
  wasExco: false,
  excoRole: ''
})

const resetForm = () => {
  form.value = {
    _id: '', name: '', email: '', graduationYear: '', profession: '', location: '',
    phone: '', linkedInProfile: '', bio: '', photoUrl: '', currentCompany: '',
    wasExco: false, excoRole: ''
  }
}

const openModal = (alumnus: any = null) => {
  if (alumnus) {
    isEditing.value = true
    form.value = { 
      _id: alumnus._id,
      name: alumnus.name || '',
      email: alumnus.email || '',
      graduationYear: alumnus.graduationYear || '',
      profession: alumnus.profession || '',
      location: alumnus.location || '',
      phone: alumnus.phone || '',
      linkedInProfile: alumnus.linkedInProfile || '',
      bio: alumnus.bio || '',
      photoUrl: alumnus.photoUrl || '',
      currentCompany: alumnus.currentCompany || '',
      wasExco: !!alumnus.wasExco,
      excoRole: alumnus.excoRole || ''
    }
  } else {
    isEditing.value = false
    resetForm()
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  resetForm()
}

const saveAlumnus = async () => {
  try {
    isSaving.value = true
    const { _id, ...submitData } = form.value

    if (isEditing.value) {
      await update(form.value._id, submitData)
    } else {
      await create(submitData)
    }
    await fetchAll()
    closeModal()
  } catch (error) {
    console.error('Failed to save alumnus:', error)
    alert('Failed to save alumnus. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = (alumnus: any) => {
  alumnusToDelete.value = alumnus
  isDeleteModalOpen.value = true
}

const deleteAlumnus = async () => {
  if (!alumnusToDelete.value) return
  try {
    isDeleting.value = true
    await remove(alumnusToDelete.value._id)
    await fetchAll()
    isDeleteModalOpen.value = false
    alumnusToDelete.value = null
  } catch (error) {
    console.error('Failed to delete alumnus:', error)
    alert('Failed to delete alumnus. Please try again.')
  } finally {
    isDeleting.value = false
  }
}
</script>
