<template>
  <div class="space-y-3">
    <label v-if="label" class="block text-sm font-semibold text-gray-700">{{ label }}</label>
    <div class="flex flex-col gap-3">
      <div v-if="modelValue" class="relative group h-64 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
        <img :src="modelValue" alt="Uploaded Image" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <button type="button" @click="$emit('update:modelValue', '')" class="text-white hover:text-red-400 bg-black/50 p-3 rounded-full transition-colors shadow-lg">
            <LucideTrash2 class="w-6 h-6" />
          </button>
        </div>
      </div>
      <div v-else class="h-48 w-full rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 flex flex-col items-center justify-center text-blue-500 shadow-sm transition-colors hover:bg-blue-100">
        <LucideImage class="w-10 h-10 mb-2 opacity-75" />
        <span class="text-sm font-medium">No image uploaded</span>
      </div>

      <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Upload from Computer -->
        <label class="relative cursor-pointer bg-white border border-gray-200 hover:border-royalBlue hover:bg-blue-50 transition-all duration-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm group">
          <input type="file" class="sr-only" accept="image/*" @change="uploadImage" :disabled="isUploading">
          <LucideUploadCloud class="w-6 h-6 text-royalBlue group-hover:scale-110 transition-transform" />
          <div class="flex-1 text-sm">
            <span v-if="isUploading" class="text-royalBlue font-semibold flex items-center">
               <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-royalBlue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
               Uploading...
            </span>
            <span v-else class="text-gray-700 font-medium group-hover:text-royalBlue transition-colors">Upload from computer</span>
          </div>
        </label>

        <!-- Choose from Gallery -->
        <button type="button" @click="isGalleryModalOpen = true" class="relative cursor-pointer bg-white border border-gray-200 hover:border-royalBlue hover:bg-blue-50 transition-all duration-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm group">
          <LucideImages class="w-6 h-6 text-royalBlue group-hover:scale-110 transition-transform" />
          <div class="flex-1 text-sm text-left">
            <span class="text-gray-700 font-medium group-hover:text-royalBlue transition-colors">Choose from gallery</span>
          </div>
        </button>
      </div>
      <p class="text-xs text-gray-500 font-medium text-center">Supported formats: JPG, PNG, GIF</p>
    </div>

    <GallerySelectorModal 
      :isOpen="isGalleryModalOpen" 
      @close="isGalleryModalOpen = false" 
      @select="handleGallerySelection" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LucideImage, LucideUploadCloud, LucideTrash2, LucideImages } from 'lucide-vue-next';
import { useApi } from '~/composables/useApi';
import GallerySelectorModal from '~/components/GallerySelectorModal.vue';

const props = defineProps<{
  modelValue: string;
  label?: string;
}>();

const emit = defineEmits(['update:modelValue']);
const isUploading = ref(false);
const isGalleryModalOpen = ref(false);

const { apiClient } = useApi();
const { showToast } = useToast();

const handleGallerySelection = (url: string) => {
  emit('update:modelValue', url);
};

async function uploadImage(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;

  const file = target.files[0];
  isUploading.value = true;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Support either direct response {url} or wrapped {data: {url}}
    const url = response.data?.url || response.data?.data?.url;
    if (url) {
      emit('update:modelValue', url);
    } else {
      throw new Error('No URL returned from server');
    }
  } catch (err) {
    console.error('Error uploading image:', err);
    showToast('Failed to upload image. Please check your connection and try again.', 'error');
  } finally {
    isUploading.value = false;
    target.value = ''; // Reset input
  }
}
</script>
