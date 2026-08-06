<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-800">About Us Content</h2>
        <p class="text-gray-500 text-sm">Manage the fellowship history and statement of faith.</p>
      </div>
      <div v-if="saveStatus" class="text-sm font-medium" :class="saveStatus === 'Saving...' ? 'text-amber-500' : 'text-emerald-500'">
        {{ saveStatus }}
      </div>
    </div>
    
    <div v-if="pending" class="p-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-royalBlue"></div>
    </div>
    
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <form @submit.prevent="saveAbout" class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Our History</label>
          <textarea v-model="settings.history" rows="6" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Statement of Faith (List)</label>
          <textarea v-model="settings.statementOfFaith" rows="4" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue"></textarea>
          <p class="text-xs text-gray-400 mt-1">Enter each point on a new line starting with a hyphen.</p>
        </div>
        <div class="pt-4 border-t border-gray-100 flex justify-end">
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
  history: 'The Celestial Church of Christ Students Fellowship, Medilag chapter began in...',
  statementOfFaith: '- We believe in the Holy Trinity.\n- We believe in the death and resurrection of Jesus Christ.'
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

const saveAbout = async () => {
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
