<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-semibold text-gray-700 mb-1">{{ label }}</label>
    <div class="flex items-center gap-4">
      <div v-if="modelValue" class="relative group p-4 w-48 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between shadow-sm overflow-hidden">
        <a :href="modelValue" target="_blank" class="truncate text-sm text-royalBlue hover:underline flex items-center">
          <LucideFileText class="w-5 h-5 mr-2 flex-shrink-0" />
          <span class="truncate">View File</span>
        </a>
        <button type="button" @click="$emit('update:modelValue', '')" class="text-gray-400 hover:text-red-500 transition-colors ml-2">
          <LucideTrash2 class="w-5 h-5" />
        </button>
      </div>
      <div v-else class="h-16 w-48 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm transition-colors hover:bg-blue-100">
        <LucideFileText class="w-6 h-6 mr-2 opacity-75" />
        <span class="text-xs font-medium">No file</span>
      </div>

      <div class="flex-1">
        <label class="relative cursor-pointer bg-white border border-gray-200 hover:border-royalBlue hover:bg-blue-50 transition-all duration-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm group">
          <input type="file" class="sr-only" accept=".pdf,.doc,.docx" @change="uploadFile" :disabled="isUploading">
          <LucideUploadCloud class="w-6 h-6 text-royalBlue group-hover:scale-110 transition-transform" />
          <div class="flex-1 text-sm">
            <span v-if="isUploading" class="text-royalBlue font-semibold flex items-center">
               <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-royalBlue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
               Uploading...
            </span>
            <span v-else class="text-gray-700 font-medium group-hover:text-royalBlue transition-colors">Click to upload document</span>
          </div>
        </label>
        <p class="mt-2 text-xs text-gray-500 font-medium">Supported formats: PDF, DOC, DOCX</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LucideFileText, LucideUploadCloud, LucideTrash2 } from 'lucide-vue-next';
import { useApi } from '~/composables/useApi';

const props = defineProps<{
  modelValue: string;
  label?: string;
}>();

const emit = defineEmits(['update:modelValue']);
const isUploading = ref(false);

const { apiClient } = useApi();
const { showToast } = useToast();

async function uploadFile(event: Event) {
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
    
    const url = response.data?.url || response.data?.data?.url;
    if (url) {
      emit('update:modelValue', url);
    } else {
      throw new Error('No URL returned from server');
    }
  } catch (err) {
    console.error('Error uploading document:', err);
    showToast('Failed to upload document. Please check your connection and try again.', 'error');
  } finally {
    isUploading.value = false;
    target.value = ''; // Reset input
  }
}
</script>
