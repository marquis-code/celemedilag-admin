<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-800">Home Page Management</h2>
        <p class="text-gray-500 text-sm">Manage the hero banner, vision, and mission statements.</p>
      </div>
      <div v-if="saveStatus" class="text-sm font-medium" :class="saveStatus === 'Saving...' ? 'text-amber-500' : 'text-emerald-500'">
        {{ saveStatus }}
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Hero Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 class="font-bold text-gray-800">Hero Section</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Main Headline</label>
            <input v-model="settings.heroHeadline" type="text" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sub Headline</label>
            <textarea v-model="settings.heroSubheadline" rows="3" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
            <ImageUpload v-model="settings.heroImage" />
          </div>
        </div>
      </div>

      <!-- Vision & Mission -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 class="font-bold text-gray-800">Vision & Mission</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Our Vision</label>
            <textarea v-model="settings.vision" rows="4" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Our Mission</label>
            <textarea v-model="settings.mission" rows="4" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import ImageUpload from '~/components/ImageUpload.vue';

const settings = ref({
  heroHeadline: 'Raising Spiritually Grounded Believers',
  heroSubheadline: 'Welcome to the official digital home of the Celestial Church of Christ Students Fellowship, College of Medicine, University of Lagos (CELEMEDILAG).',
  heroImage: '',
  vision: "To raise spiritually grounded believers who grow into their full potential in Christ, reveal God's glory on campus and beyond, and become leaders of excellence in every sphere of life.",
  mission: 'To nurture and disciple students into spiritual maturity, empowering them to manifest Christlike excellence in academics, character, leadership, and service.'
});

const saveStatus = ref('');
let saveTimeout: ReturnType<typeof setTimeout>;

// Fetch initial settings
onMounted(async () => {
  try {
    const res = await fetch('http://127.0.0.1:3001/api/settings');
    const data = await res.json();
    data.forEach((item: any) => {
      if (settings.value[item.key as keyof typeof settings.value] !== undefined) {
        settings.value[item.key as keyof typeof settings.value] = item.value;
      }
    });
  } catch (err) {
    console.error('Failed to fetch settings:', err);
  }
});

// Watch for deep changes in settings and debounce save
watch(settings, (newVal) => {
  saveStatus.value = 'Saving...';
  clearTimeout(saveTimeout);
  
  saveTimeout = setTimeout(async () => {
    try {
      // Save all settings iteratively (aggressive CMS)
      const promises = Object.keys(newVal).map((key) => {
        return fetch(`http://127.0.0.1:3001/api/settings/${key}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: newVal[key as keyof typeof newVal] })
        });
      });
      await Promise.all(promises);
      saveStatus.value = 'Saved automatically';
      setTimeout(() => { if (saveStatus.value === 'Saved automatically') saveStatus.value = '' }, 2000);
    } catch (err) {
      saveStatus.value = 'Save failed';
      console.error(err);
    }
  }, 500); // 500ms debounce
}, { deep: true });
</script>
