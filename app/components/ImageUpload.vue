<template>
  <div class="space-y-4">
    <div class="flex items-center gap-4">
      <div v-if="modelValue" class="relative group h-32 w-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <img :src="modelValue" alt="Uploaded Image" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button type="button" @click="$emit('update:modelValue', '')" class="text-white hover:text-red-400">
            <LucideTrash2 class="w-6 h-6" />
          </button>
        </div>
      </div>
      <div v-else class="h-32 w-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center text-gray-500">
        <LucideImage class="w-8 h-8 mb-2" />
        <span class="text-xs">No image</span>
      </div>

      <div class="flex-1">
        <label class="relative cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors rounded-xl px-4 py-3 flex items-center gap-3">
          <input type="file" class="sr-only" accept="image/*" @change="uploadImage" :disabled="isUploading">
          <LucideUploadCloud class="w-5 h-5 text-gray-400" />
          <div class="flex-1 text-sm">
            <span v-if="isUploading" class="text-emerald-600 font-medium animate-pulse">Uploading to Cloudinary...</span>
            <span v-else class="text-gray-700 dark:text-gray-300 font-medium">Click to upload new image</span>
          </div>
        </label>
        <p class="mt-2 text-xs text-gray-500">Supported formats: JPG, PNG, GIF</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LucideImage, LucideUploadCloud, LucideTrash2 } from 'lucide-vue-next';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue']);
const isUploading = ref(false);

async function uploadImage(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;

  const file = target.files[0];
  isUploading.value = true;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://127.0.0.1:3001/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Upload failed');
    
    const data = await response.json();
    emit('update:modelValue', data.url);
  } catch (err) {
    console.error('Error uploading image:', err);
    alert('Failed to upload image to Cloudinary.');
  } finally {
    isUploading.value = false;
    target.value = '';
  }
}
</script>
