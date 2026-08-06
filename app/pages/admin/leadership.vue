<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-800">Manage Leadership</h2>
        <p class="text-gray-500 text-sm mt-1">Add, edit, or remove executive members.</p>
      </div>
      <button @click="openModal()" class="bg-royalBlue text-white px-4 py-2.5 rounded-xl font-medium hover:bg-skyBlue transition flex items-center shadow-sm">
        <Plus class="w-5 h-5 mr-2" />
        Add Executive
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="p-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-royalBlue"></div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="executives.length === 0" class="mt-8">
      <EmptyState 
        title="No Leaders Found" 
        description="The leadership roster is currently empty. Add your first executive member."
        actionText="Add Executive"
        @action="openModal()"
      >
        <template #icon>
          <Users class="w-12 h-12 text-gray-400" />
        </template>
      </EmptyState>
    </div>

    <!-- Leadership Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-colors duration-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Executive</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role & Tenure</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="exec in executives" :key="exec._id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <div v-if="exec.avatar" class="h-10 w-10 rounded-full bg-cover bg-center border border-gray-200" :style="`background-image: url(${exec.avatar})`"></div>
                  <div v-else class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                    {{ exec.name ? exec.name.charAt(0) : '?' }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-semibold text-gray-900">{{ exec.name }}</div>
                  <div class="text-xs text-gray-500">{{ exec.email || 'No email' }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 font-medium">{{ exec.position }}</div>
              <div class="text-xs text-gray-500">{{ exec.tenure }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="['px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md', exec.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800']">
                {{ exec.isActive !== false ? 'Active' : 'Past Executive' }}
              </span>
              <span v-if="exec.isAlumni" class="ml-2 px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-purple-100 text-purple-800">
                Alumni
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openModal(exec)" class="text-royalBlue hover:text-skyBlue mr-4 transition-colors">Edit</button>
              <button @click="confirmDelete(exec._id)" class="text-red-500 hover:text-red-600 transition-colors">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-start justify-center z-50 transition-opacity overflow-y-auto pt-10 pb-10">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-100 my-auto">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
          <h3 class="text-lg font-bold text-gray-900">{{ isEditing ? 'Edit Executive' : 'Add Executive' }}</h3>
          <button @click="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>
        <form @submit.prevent="saveExecutive" class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <div class="space-y-4">
             <h4 class="font-semibold text-gray-700 border-b pb-2">Basic Information</h4>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
               <BaseInput v-model="form.name" label="Full Name *" placeholder="e.g. Dr. Emmanuel Ojo" required />
               <BaseInput v-model="form.position" label="Position / Role *" placeholder="e.g. President" required />
             </div>
             
             <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
               <BaseInput v-model="form.email" type="email" label="Email Address" placeholder="e.g. email@example.com" />
               <BaseInput v-model="form.phone" type="tel" label="Phone Number" placeholder="+234..." />
             </div>
             
             <div class="w-full">
               <label class="block text-sm font-semibold mb-1.5 transition-colors text-gray-700">Short Bio</label>
               <textarea v-model="form.bio" rows="2" class="appearance-none block w-full px-4 py-2.5 rounded-xl border bg-white transition-all duration-200 focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue" placeholder="Brief biography..."></textarea>
             </div>
          </div>
          
          <div class="space-y-4">
             <h4 class="font-semibold text-gray-700 border-b pb-2">Tenure & Settings</h4>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
               <BaseInput v-model="form.tenure" label="Tenure (Years) *" placeholder="e.g. 2023 - 2024" required />
               <BaseInput v-model="form.order" type="number" label="Display Order" placeholder="1" />
             </div>
             <ImageUpload v-model="form.avatar" label="Avatar Image Upload" />
             
             <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
               <div class="flex items-center">
                 <input type="checkbox" id="isActive" v-model="form.isActive" class="rounded border-gray-300 text-royalBlue focus:ring-royalBlue w-5 h-5" />
                 <label for="isActive" class="text-sm font-medium text-gray-700 ml-2">Active Executive</label>
               </div>
               <div class="flex items-center">
                 <input type="checkbox" id="isAlumni" v-model="form.isAlumni" class="rounded border-gray-300 text-royalBlue focus:ring-royalBlue w-5 h-5" />
                 <label for="isAlumni" class="text-sm font-medium text-gray-700 ml-2">Is Alumni</label>
               </div>
             </div>
          </div>

          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Social Links</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseInput v-model="form.socialLinks.linkedin" label="LinkedIn URL" placeholder="https://linkedin.com/in/..." />
              <BaseInput v-model="form.socialLinks.twitter" label="Twitter/X URL" placeholder="https://twitter.com/..." />
            </div>
          </div>

          <div class="pt-6 mt-6 border-t border-gray-100 flex justify-end space-x-3 sticky bottom-0 bg-white pb-2">
            <button type="button" @click="closeModal()" class="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" class="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-royalBlue hover:bg-skyBlue transition-colors shadow-sm disabled:opacity-50 flex items-center" :disabled="saving">
              <span v-if="saving" class="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              {{ saving ? 'Saving...' : 'Save Executive' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Remove Executive"
      message="Are you sure you want to remove this leader? This action cannot be undone."
      type="danger"
      confirmText="Remove"
      :loading="deleting"
      @confirm="executeDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Plus, Users, User, X } from 'lucide-vue-next'
import EmptyState from '~/components/EmptyState.vue'
import BaseInput from '~/components/BaseInput.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'

const { useLeadershipApi } = useApi()
const { data: executivesRaw, pending, error, fetchAll, create, update, remove } = useLeadershipApi()

onMounted(async () => {
  await fetchAll()
})

const executives = computed(() => {
  const list = executivesRaw.value || []
  return [...list].sort((a, b) => (a.order || 99) - (b.order || 99))
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const currentId = ref('')

const form = ref({
  name: '',
  position: '',
  tenure: '',
  avatar: '',
  email: '',
  phone: '',
  bio: '',
  isActive: true,
  isAlumni: false,
  order: 99,
  socialLinks: {
    linkedin: '',
    twitter: ''
  }
})

const openModal = (exec?: any) => {
  if (exec) {
    isEditing.value = true
    currentId.value = exec._id
    form.value = {
      name: exec.name || '',
      position: exec.position || '',
      tenure: exec.tenure || '',
      avatar: exec.avatar || '',
      email: exec.email || '',
      phone: exec.phone || '',
      bio: exec.bio || '',
      isActive: exec.isActive !== false,
      isAlumni: !!exec.isAlumni,
      order: exec.order || 99,
      socialLinks: {
        linkedin: exec.socialLinks?.linkedin || '',
        twitter: exec.socialLinks?.twitter || ''
      }
    }
  } else {
    isEditing.value = false
    currentId.value = ''
    form.value = { 
      name: '', position: '', tenure: '', avatar: '', email: '', phone: '', bio: '',
      isActive: true, isAlumni: false, order: 99, socialLinks: { linkedin: '', twitter: '' }
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveExecutive = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await update(currentId.value, form.value)
    } else {
      await create(form.value)
    }
    await fetchAll()
    closeModal()
  } catch (err) {
    console.error('Error saving executive', err)
    alert('Failed to save executive')
  } finally {
    saving.value = false
  }
}

// Delete Logic
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
    console.error('Error deleting executive', err)
    alert('Failed to delete executive')
  } finally {
    deleting.value = false
  }
}
</script>
