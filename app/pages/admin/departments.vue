<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-800">Departments & Units</h2>
        <p class="text-gray-500 text-sm">Manage the various units in the fellowship.</p>
      </div>
      <button @click="openModal()" class="bg-royalBlue text-white px-4 py-2 rounded-lg font-medium hover:bg-skyBlue transition flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Add Department
      </button>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-if="!pending && (!departments || departments.length === 0)"
      icon="Building2"
      title="No departments found"
      description="Get started by adding your first department."
      actionLabel="Add Department"
      @action="openModal()"
    />
    
    <div v-else-if="pending" class="p-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-royalBlue"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="department in departments" :key="department._id" class="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div class="h-32 bg-gray-200 relative overflow-hidden">
          <div v-if="department.coverImageUrl" class="absolute inset-0 bg-cover bg-center" :style="`background-image: url(${department.coverImageUrl})`"></div>
          <div v-else class="absolute inset-0 bg-blue-50 flex items-center justify-center">
            <svg class="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <div class="absolute top-2 right-2">
            <span :class="['px-2 py-1 text-xs font-bold rounded shadow-sm', department.isActive !== false ? 'bg-green-500 text-white' : 'bg-red-500 text-white']">
               {{ department.isActive !== false ? 'Active' : 'Inactive' }}
             </span>
          </div>
        </div>
        <div class="p-5 flex flex-col flex-grow">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-lg text-royalBlue truncate pr-2">{{ department.name }}</h3>
          </div>
          <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ department.description }}</p>
          
          <div class="mt-auto space-y-2">
            <div v-if="department.headOfDepartment" class="text-xs text-gray-500 flex items-center">
              <span class="font-semibold text-gray-700 w-16">HOD:</span> {{ department.headOfDepartment }}
            </div>
            <div v-if="department.meetingTime" class="text-xs text-gray-500 flex items-center">
              <span class="font-semibold text-gray-700 w-16">Meetings:</span> {{ department.meetingTime }}
            </div>
            <div class="pt-4 flex justify-end space-x-2 border-t border-gray-50 mt-4">
              <button @click="openModal(department)" class="text-indigo-600 hover:text-indigo-900 text-sm font-medium px-2 py-1 bg-indigo-50 rounded hover:bg-indigo-100 transition">Edit</button>
              <button @click="confirmDelete(department)" class="text-red-600 hover:text-red-900 text-sm font-medium px-2 py-1 bg-red-50 rounded hover:bg-red-100 transition">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto pt-10 pb-10">
      <div class="bg-white rounded-xl shadow-lg max-w-2xl w-full my-auto border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 class="text-xl font-display font-bold text-gray-800">{{ isEditing ? 'Edit Department' : 'Add Department' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <form @submit.prevent="saveDepartment" class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Basic Info</h4>
            <BaseInput v-model="form.name" label="Department Name *" placeholder="e.g. Choir Unit" required />
            <div class="w-full">
              <label class="block text-sm font-semibold mb-1.5 transition-colors text-gray-700">Description</label>
              <textarea v-model="form.description" rows="3" class="appearance-none block w-full px-4 py-2.5 rounded-xl border bg-white transition-all duration-200 focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue" placeholder="A short description of the unit..."></textarea>
            </div>
            <ImageUpload v-model="form.coverImageUrl" label="Cover Image Upload" />
          </div>

          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Leadership & Meetings</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseInput v-model="form.headOfDepartment" label="Head of Department (HOD)" placeholder="Name of HOD" />
              <BaseInput v-model="form.meetingTime" label="Meeting Time" placeholder="e.g. Saturdays, 4:00 PM" />
            </div>
            <BaseInput v-model="form.meetingLocation" label="Meeting Location" placeholder="e.g. Main Auditorium" />
          </div>

          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Contact Info</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseInput v-model="form.contactEmail" type="email" label="Contact Email" placeholder="dept@example.com" />
              <BaseInput v-model="form.contactPhone" type="tel" label="Contact Phone" placeholder="+234..." />
            </div>
            <div class="flex items-center mt-2">
              <input type="checkbox" id="isActive" v-model="form.isActive" class="rounded border-gray-300 text-royalBlue focus:ring-royalBlue w-5 h-5" />
              <label for="isActive" class="text-sm font-medium text-gray-700 ml-2">Active Department</label>
            </div>
          </div>
          
          <div class="pt-6 mt-6 border-t border-gray-100 flex justify-end space-x-3 sticky bottom-0 bg-white pb-2">
            <button type="button" @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" :disabled="isSaving" class="px-4 py-2 bg-royalBlue text-white rounded-lg hover:bg-skyBlue font-medium transition flex items-center justify-center min-w-[140px]">
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSaving ? 'Saving...' : 'Save Department' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmModal 
      :isOpen="isDeleteModalOpen"
      title="Delete Department"
      message="Are you sure you want to remove this department? This action cannot be undone."
      confirmText="Yes, delete department"
      :loading="isDeleting"
      @confirm="deleteDepartment"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '~/components/BaseInput.vue'
import EmptyState from '~/components/EmptyState.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'

const { useDepartmentsApi } = useApi()
const { data: departments, pending, error, fetchAll, create, update, remove } = useDepartmentsApi()
const { showToast } = useToast()

onMounted(async () => {
  await fetchAll()
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const isDeleteModalOpen = ref(false)
const deptToDelete = ref<any>(null)

const form = ref({
  _id: '',
  name: '',
  description: '',
  headOfDepartment: '',
  meetingTime: '',
  meetingLocation: '',
  contactEmail: '',
  contactPhone: '',
  coverImageUrl: '',
  isActive: true
})

const resetForm = () => {
  form.value = {
    _id: '',
    name: '',
    description: '',
    headOfDepartment: '',
    meetingTime: '',
    meetingLocation: '',
    contactEmail: '',
    contactPhone: '',
    coverImageUrl: '',
    isActive: true
  }
}

const openModal = (dept: any = null) => {
  if (dept) {
    isEditing.value = true
    form.value = { 
      _id: dept._id,
      name: dept.name || '',
      description: dept.description || '',
      headOfDepartment: dept.headOfDepartment || '',
      meetingTime: dept.meetingTime || '',
      meetingLocation: dept.meetingLocation || '',
      contactEmail: dept.contactEmail || '',
      contactPhone: dept.contactPhone || '',
      coverImageUrl: dept.coverImageUrl || '',
      isActive: dept.isActive !== false
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

const saveDepartment = async () => {
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
    console.error('Failed to save department:', error)
    showToast('Failed to save department. Please try again.', 'error')
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = (dept: any) => {
  deptToDelete.value = dept
  isDeleteModalOpen.value = true
}

const deleteDepartment = async () => {
  if (!deptToDelete.value) return
  try {
    isDeleting.value = true
    await remove(deptToDelete.value._id)
    await fetchAll()
    isDeleteModalOpen.value = false
    deptToDelete.value = null
  } catch (error) {
    console.error('Failed to delete department:', error)
    showToast('Failed to delete department. Please try again.', 'error')
  } finally {
    isDeleting.value = false
  }
}
</script>
