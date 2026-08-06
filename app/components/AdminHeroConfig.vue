<template>
  <div class="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
    <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2 capitalize">{{ title }} Hero Configuration</h3>
    
    <div class="grid grid-cols-1 gap-6">
      <div>
        <label class="block text-sm font-semibold mb-1.5 text-gray-700">Hero Display Type</label>
        <BaseSelect 
          v-model="settings[heroTypeKey]" 
          :options="[{label: 'Single Image', value: 'single'}, {label: 'Image Carousel', value: 'carousel'}]" 
        />
      </div>
      
      <div v-if="settings[heroTypeKey] === 'carousel'">
        <MultiImageUpload v-model="settings[heroCarouselImagesKey]" label="Carousel Images" />
      </div>
      <div v-else>
        <ImageUpload v-model="settings[heroImageKey]" label="Single Hero Image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  pageKey: string;
  title: string;
  settings: Record<string, any>;
  customHeroImageKey?: string;
}>();

const heroTypeKey = computed(() => `${props.pageKey}_heroType`);
const heroImageKey = computed(() => props.customHeroImageKey || `${props.pageKey}_heroImage`);
const heroCarouselImagesKey = computed(() => `${props.pageKey}_heroCarouselImages`);

// Ensure default value is 'single' if undefined
if (!props.settings[heroTypeKey.value]) {
  props.settings[heroTypeKey.value] = 'single';
}
if (!props.settings[heroCarouselImagesKey.value]) {
  props.settings[heroCarouselImagesKey.value] = [];
}
</script>
