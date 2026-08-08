<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-display font-bold text-gray-800">Manage News & Blog</h2>
      <button @click="openModal()" class="bg-royalBlue text-white px-4 py-2 rounded-xl font-medium hover:bg-skyBlue transition flex items-center shadow-sm">
        <Plus class="w-5 h-5 mr-2" />
        Post News
      </button>
    </div>

    <div v-if="pending" class="p-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-royalBlue"></div>
    </div>
    
    <div v-else-if="error" class="mt-8">
      <EmptyState 
        title="Connection Error" 
        description="We couldn't load the news articles at this time. Please check your connection and try again."
        actionText="Try Again"
        :isError="true"
        @action="refresh()"
      />
    </div>

    <div v-else-if="!news || news.length === 0" class="mt-8">
      <EmptyState 
        title="No News Articles Found" 
        description="There are currently no news articles or blog posts. Create your first post to get started."
        actionText="Post News"
        @action="openModal()"
      >
        <template #icon>
          <Newspaper class="w-12 h-12 text-gray-400" />
        </template>
      </EmptyState>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-colors duration-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Article</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
            <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="article in news" :key="article._id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <img v-if="article.coverImageUrl" :src="article.coverImageUrl" class="w-12 h-12 rounded-lg object-cover mr-3 border border-gray-200" />
                <div v-else class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-3 border border-gray-200">
                  <Newspaper class="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <div class="text-sm font-semibold text-gray-900">{{ article.title }}</div>
                  <div class="text-xs text-gray-500 max-w-xs truncate">{{ article.summary || 'No summary provided' }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md',
                article.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              ]">
                {{ article.isPublished ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-blue-100 text-blue-800">
                {{ article.category || 'Uncategorized' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ article.author || 'Anonymous' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openModal(article)" class="text-royalBlue hover:text-skyBlue mr-4 transition-colors">Edit</button>
              <button @click="confirmDelete(article._id)" class="text-red-500 hover:text-red-600 transition-colors">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-start justify-center z-50 transition-opacity overflow-y-auto pt-10 pb-10">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-gray-100 my-auto">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
          <h3 class="text-lg font-bold text-gray-900">{{ isEditing ? 'Edit News Article' : 'Post New Article' }}</h3>
          <button @click="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>
        <form @submit.prevent="saveNews" class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Article Basics</h4>
            <BaseInput v-model="form.title" label="Title *" placeholder="Article Title" required />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseSelect v-model="form.category" label="Category" :options="categoryOptions" placeholder="Select a category" />
              <BaseInput v-model="form.author" label="Author" placeholder="Author name" />
            </div>
            <div class="w-full">
              <label class="block text-sm font-semibold mb-1.5 transition-colors text-gray-700">Summary / Excerpt</label>
              <textarea v-model="form.summary" rows="2" class="appearance-none block w-full px-4 py-2.5 rounded-xl border bg-white transition-all duration-200 focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue" placeholder="Brief summary of the article..."></textarea>
            </div>
            <div class="w-full">
              <label class="block text-sm font-semibold mb-1.5 transition-colors text-gray-700">Full Content</label>
              <textarea v-model="form.content" rows="6" class="appearance-none block w-full px-4 py-2.5 rounded-xl border bg-white transition-all duration-200 focus:outline-none focus:ring-2 sm:text-sm shadow-sm border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue" placeholder="Write your article here..."></textarea>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="font-semibold text-gray-700 border-b pb-2">Media & Settings</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ImageUpload v-model="form.coverImageUrl" label="Cover Image Upload" />
              <BaseInput v-model="form.publishedAt" type="date" label="Publish Date" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-semibold mb-1.5 text-gray-700">Tags (comma separated)</label>
                <input v-model="tagsInput" type="text" placeholder="Youth, Prayer, Outreach" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-royalBlue/20 focus:border-royalBlue outline-none" />
              </div>
              <div class="flex items-center mt-8">
                <input type="checkbox" id="isPublished" v-model="form.isPublished" class="rounded border-gray-300 text-royalBlue focus:ring-royalBlue w-5 h-5" />
                <label for="isPublished" class="text-sm font-medium text-gray-700 ml-2">Published to live site</label>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between items-center border-b pb-2">
              <h4 class="font-semibold text-gray-700">In-Article Gallery Images</h4>
              <button type="button" @click="addGalleryUrl" class="text-sm text-royalBlue hover:text-skyBlue font-medium flex items-center">
                <Plus class="w-4 h-4 mr-1" /> Add Image
              </button>
            </div>
            
            <div v-if="form.galleryUrls.length === 0" class="text-sm text-gray-500 italic py-2">
              No gallery images added.
            </div>
            
            <div v-for="(url, index) in form.galleryUrls" :key="index" class="flex items-center space-x-2">
              <ImageUpload v-model="form.galleryUrls[index]" label="Gallery Image Upload" class="flex-1" />
              <button type="button" @click="removeGalleryUrl(index)" class="text-red-500 hover:text-red-700 p-2">
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="pt-6 mt-6 border-t border-gray-100 flex justify-end space-x-3 sticky bottom-0 bg-white pb-2">
            <button type="button" @click="closeModal()" class="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" class="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-royalBlue hover:bg-skyBlue transition-colors shadow-sm disabled:opacity-50 flex items-center" :disabled="saving">
              <span v-if="saving" class="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              {{ saving ? 'Saving...' : 'Save Article' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Delete News Article"
      message="Are you sure you want to delete this news article? This action cannot be undone."
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
import { Plus, X, Newspaper } from 'lucide-vue-next'
import BaseInput from '~/components/BaseInput.vue'
import BaseSelect from '~/components/BaseSelect.vue'
import EmptyState from '~/components/EmptyState.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'

const { useNewsApi } = useApi()
const { data: news, pending, error, fetchAll, create, update, remove } = useNewsApi()
const { showToast } = useToast()

onMounted(async () => {
  await fetchAll()
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const currentId = ref('')
const tagsInput = ref('')

const categoryOptions = [
  { label: 'Devotionals', value: 'Devotionals' },
  { label: 'Campus Life', value: 'Campus Life' },
  { label: 'Medical Missions', value: 'Medical Missions' },
  { label: 'Fellowship News', value: 'Fellowship News' }
]

const form = ref({
  title: '',
  category: 'Fellowship News',
  author: '',
  content: '',
  summary: '',
  coverImageUrl: '',
  tags: [] as string[],
  galleryUrls: [] as string[],
  isPublished: true,
  publishedAt: ''
})

const addGalleryUrl = () => {
  form.value.galleryUrls.push('')
}

const removeGalleryUrl = (index: number) => {
  form.value.galleryUrls.splice(index, 1)
}

const openModal = (article?: any) => {
  if (article) {
    isEditing.value = true
    currentId.value = article._id
    tagsInput.value = article.tags ? article.tags.join(', ') : ''
    
    let formattedDate = ''
    if (article.publishedAt) {
      try {
        formattedDate = new Date(article.publishedAt).toISOString().split('T')[0]
      } catch(e) {}
    }

    form.value = {
      title: article.title || '',
      category: article.category || 'Fellowship News',
      author: article.author || '',
      content: article.content || '',
      summary: article.summary || '',
      coverImageUrl: article.coverImageUrl || '',
      tags: article.tags ? [...article.tags] : [],
      galleryUrls: article.galleryUrls ? [...article.galleryUrls] : [],
      isPublished: article.isPublished !== false,
      publishedAt: formattedDate
    }
  } else {
    isEditing.value = false
    currentId.value = ''
    tagsInput.value = ''
    form.value = { 
      title: '', category: 'Fellowship News', author: '', content: '',
      summary: '', coverImageUrl: '', tags: [], galleryUrls: [],
      isPublished: true, publishedAt: new Date().toISOString().split('T')[0]
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveNews = async () => {
  saving.value = true
  try {
    form.value.tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t)
    
    // Cleanup empty gallery urls
    form.value.galleryUrls = form.value.galleryUrls.filter(url => url.trim() !== '')

    if (isEditing.value) {
      await update(currentId.value, form.value)
    } else {
      await create(form.value)
    }
    await fetchAll()
    closeModal()
  } catch (e) {
    console.error('Error saving news', e)
    showToast('Failed to save news article', 'error')
  } finally {
    saving.value = false
  }
}

const isDeleteModalOpen = ref(false)
const articleToDelete = ref('')
const deleting = ref(false)

const confirmDelete = (id: string) => {
  articleToDelete.value = id
  isDeleteModalOpen.value = true
}

const executeDelete = async () => {
  if (!articleToDelete.value) return
  deleting.value = true
  try {
    await remove(articleToDelete.value)
    await fetchAll()
    isDeleteModalOpen.value = false
  } catch (e) {
    console.error('Error deleting news', e)
    showToast('Failed to delete article', 'error')
  } finally {
    deleting.value = false
  }
}
</script>
