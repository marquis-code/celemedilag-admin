<template>
  <div class="space-y-4">
    <label v-if="label" class="block text-sm font-semibold text-gray-700">{{ label }}</label>
    
    <!-- Image List -->
    <div v-if="modelValue && modelValue.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="(img, index) in modelValue" :key="index" class="relative group aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
        <img :src="img" alt="Uploaded Image" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-2">
          <button type="button" @click="moveLeft(index)" :disabled="index === 0" class="text-white hover:text-royalBlue bg-black/50 p-2 rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            <LucideArrowLeft class="w-4 h-4" />
          </button>
          <button type="button" @click="removeImage(index)" class="text-white hover:text-red-400 bg-black/50 p-2 rounded-full transition-colors shadow-lg">
            <LucideTrash2 class="w-4 h-4" />
          </button>
          <button type="button" @click="moveRight(index)" :disabled="index === modelValue.length - 1" class="text-white hover:text-royalBlue bg-black/50 p-2 rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            <LucideArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="h-32 w-full rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 flex flex-col items-center justify-center text-blue-500 shadow-sm transition-colors hover:bg-blue-100">
      <LucideImages class="w-8 h-8 mb-2 opacity-75" />
      <span class="text-sm font-medium">No images uploaded for carousel</span>
    </div>

    <!-- Upload Controls -->
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
      <!-- Upload from Computer -->
      <label class="relative cursor-pointer bg-white border border-gray-200 hover:border-royalBlue hover:bg-blue-50 transition-all duration-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm group">
        <input type="file" class="sr-only" accept="image/*" @change="uploadImage" :disabled="isUploading" multiple>
        <LucideUploadCloud class="w-6 h-6 text-royalBlue group-hover:scale-110 transition-transform" />
        <div class="flex-1 text-sm">
          <span v-if="isUploading" class="text-royalBlue font-semibold flex items-center">
             <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-royalBlue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
             Uploading...
          </span>
          <span v-else class="text-gray-700 font-medium group-hover:text-royalBlue transition-colors">Add from computer</span>
        </div>
      </label>

      <!-- Choose from Gallery -->
      <button type="button" @click="isGalleryModalOpen = true" class="relative cursor-pointer bg-white border border-gray-200 hover:border-royalBlue hover:bg-blue-50 transition-all duration-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm group">
        <LucideImages class="w-6 h-6 text-royalBlue group-hover:scale-110 transition-transform" />
        <div class="flex-1 text-sm text-left">
          <span class="text-gray-700 font-medium group-hover:text-royalBlue transition-colors">Add from gallery</span>
        </div>
      </button>
    </div>
    
    <GallerySelectorModal 
      :isOpen="isGalleryModalOpen" 
      @close="isGalleryModalOpen = false" 
      @select="handleGallerySelection" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { LucideUploadCloud, LucideTrash2, LucideImages, LucideArrowLeft, LucideArrowRight } from 'lucide-vue-next';
import { useApi } from '~/composables/useApi';
import GallerySelectorModal from '~/components/GallerySelectorModal.vue';

const props = defineProps<{
  modelValue: string[];
  label?: string;
}>();

const emit = defineEmits(['update:modelValue']);
const isUploading = ref(false);
const isGalleryModalOpen = ref(false);

const { apiClient } = useApi();

const removeImage = (index: number) => {
  const newImages = [...(props.modelValue || [])];
  newImages.splice(index, 1);
  emit('update:modelValue', newImages);
};

const moveLeft = (index: number) => {
  if (index === 0) return;
  const newImages = [...(props.modelValue || [])];
  const temp = newImages[index - 1];
  newImages[index - 1] = newImages[index];
  newImages[index] = temp;
  emit('update:modelValue', newImages);
};

const moveRight = (index: number) => {
  if (index === (props.modelValue || []).length - 1) return;
  const newImages = [...(props.modelValue || [])];
  const temp = newImages[index + 1];
  newImages[index + 1] = newImages[index];
  newImages[index] = temp;
  emit('update:modelValue', newImages);
};

const handleGallerySelection = (url: string) => {
  const newImages = [...(props.modelValue || []), url];
  emit('update:modelValue', newImages);
};

async function uploadImage(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;

  isUploading.value = true;
  const newImages = [...(props.modelValue || [])];

  for (let i = 0; i < target.files.length; i++) {
    const file = target.files[i];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const url = response.data?.url || response.data?.data?.url;
      if (url) {
        newImages.push(url);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  }
  
  emit('update:modelValue', newImages);
  isUploading.value = false;
  target.value = ''; // Reset input
}
</script>
