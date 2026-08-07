<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-800">Contact & Socials</h2>
        <p class="text-gray-500 text-sm">Manage fellowship location, contact info, and social media links.</p>
      </div>
      <div v-if="saveStatus" class="text-sm font-medium" :class="saveStatus === 'Saving...' ? 'text-amber-500' : 'text-emerald-500'">
        {{ saveStatus }}
      </div>
    </div>
    
    <div v-if="pending" class="p-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-royalBlue"></div>
    </div>
    
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <form @submit.prevent="saveContact" class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
            <input v-model="settings.address" type="text" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input v-model="settings.email" type="email" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input v-model="settings.phone" type="text" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Meeting Days/Times</label>
            <input v-model="settings.meetingTimes" type="text" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
        </div>
        
        <h3 class="font-bold text-gray-800 pt-6 border-t border-gray-100 mt-6">Social Media Links</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input v-model="settings.instagram" type="url" placeholder="https://instagram.com/..." class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Twitter (X) URL</label>
            <input v-model="settings.twitter" type="url" placeholder="https://twitter.com/..." class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
            <input v-model="settings.tiktok" type="url" placeholder="https://tiktok.com/..." class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
            <input v-model="settings.youtube" type="url" placeholder="https://youtube.com/..." class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
        </div>

        <div class="pt-6 flex justify-end">
          <button type="submit" class="bg-royalBlue text-white px-4 py-2 rounded-lg font-medium hover:bg-skyBlue transition" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const { useSettingsApi, updateSetting } = useApi();

const settings = ref({
  address: 'CMUL/LUTH Campus, Idi-Araba, Lagos',
  email: 'info@celemedilag.org',
  phone: '+234 800 000 0000',
  meetingTimes: 'Sundays 9AM, Wednesdays 6PM',
  instagram: '',
  twitter: '',
  tiktok: '',
  youtube: ''
});

const saveStatus = ref('');
const pending = ref(true);
const saving = ref(false);

onMounted(async () => {
  try {
    const fetchedSettings = await useSettingsApi();
    Object.keys(fetchedSettings).forEach(key => {
      if (settings.value[key as keyof typeof settings.value] !== undefined) {
        settings.value[key as keyof typeof settings.value] = fetchedSettings[key];
      }
    });
  } catch (err) {
    console.error('Failed to fetch settings:', err);
  } finally {
    pending.value = false;
  }
});

const saveContact = async () => {
  saving.value = true;
  saveStatus.value = 'Saving...';
  try {
    const promises = Object.keys(settings.value).map((key) => {
      return updateSetting(key, settings.value[key as keyof typeof settings.value]);
    });
    await Promise.all(promises);
    saveStatus.value = 'Saved successfully';
    setTimeout(() => { saveStatus.value = ''; }, 3000);
  } catch (err) {
    saveStatus.value = 'Save failed';
    console.error(err);
  } finally {
    saving.value = false;
  }
};
</script>
