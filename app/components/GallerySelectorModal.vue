<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] transition-opacity p-4 sm:p-6">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-gray-100 relative">
      
      <!-- Header -->
      <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
        <div>
          <h3 class="text-xl font-bold text-gray-900">Choose from Gallery</h3>
          <p class="text-sm text-gray-500 mt-1">Select an image from your existing albums</p>
        </div>
        <button @click="close" class="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-xl transition-colors shrink-0">
          <LucideX class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div v-if="pending" class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-royalBlue"></div>
        </div>
        
        <div v-else-if="allPhotos.length === 0" class="flex flex-col items-center justify-center h-full text-center">
          <LucideImage class="w-16 h-16 text-gray-300 mb-4" />
          <h4 class="text-lg font-bold text-gray-700">No images found</h4>
          <p class="text-gray-500 mt-2 max-w-md">Your gallery is currently empty. Upload images directly to the gallery or via the upload button.</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div 
            v-for="(photo, index) in allPhotos" 
            :key="index"
            @click="selectPhoto(photo.url)"
            class="relative group aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-royalBlue transition-all shadow-sm hover:shadow-md bg-white"
          >
            <img :src="photo.url" :alt="photo.caption || 'Gallery Image'" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <p class="text-white text-xs font-medium truncate drop-shadow-md">{{ photo.caption || 'No caption' }}</p>
            </div>
            
            <!-- Hover Overlay indicator -->
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="bg-royalBlue text-white p-1.5 rounded-full shadow-lg">
                <LucideCheck class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-100 bg-white flex justify-end shrink-0">
        <button @click="close" class="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
          Cancel
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { LucideX, LucideImage, LucideCheck } from 'lucide-vue-next';
import { useApi } from '~/composables/useApi';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'select']);

const { useGalleryApi } = useApi();
const { data: albums, pending, fetchAll } = useGalleryApi();

const allPhotos = computed(() => {
  if (!albums.value) return [];
  const photos = [];
  for (const album of albums.value) {
    if (album.photos && Array.isArray(album.photos)) {
      for (const p of album.photos) {
        if (p && p.url) {
          photos.push(p);
        }
      }
    }
  }
  // Remove duplicates by URL just in case
  const uniquePhotos = Array.from(new Map(photos.map(item => [item.url, item])).values());
  return uniquePhotos.reverse(); // Show newest first
});

// Fetch on mount or when opened
watch(() => props.isOpen, (newVal) => {
  if (newVal && (!albums.value || albums.value.length === 0)) {
    fetchAll();
  }
});

const selectPhoto = (url: string) => {
  emit('select', url);
  close();
};

const close = () => {
  emit('close');
};
</script>
