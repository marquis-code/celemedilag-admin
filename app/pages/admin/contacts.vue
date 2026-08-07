<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-800">Contact & Partnership Requests</h2>
        <p class="text-gray-500 text-sm">View messages submitted through the website's contact form.</p>
      </div>
    </div>

    <div v-if="pending" class="py-12 flex justify-center items-center">
      <div class="animate-pulse flex flex-col items-center">
        <div class="h-8 w-8 bg-gray-200 rounded-full mb-4"></div>
        <div class="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">
      Failed to load contact requests. Please try again.
    </div>

    <div v-else class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <EmptyState
        v-if="contacts.length === 0"
        title="No Messages Yet"
        description="When someone fills out the contact form, their message will appear here."
        icon="Mail"
      />
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <th class="p-4 pl-6">Date</th>
              <th class="p-4">Sender</th>
              <th class="p-4">Subject</th>
              <th class="p-4">Message</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="msg in contacts" :key="msg._id" class="hover:bg-gray-50 transition-colors group">
              <td class="p-4 pl-6 align-top whitespace-nowrap text-sm text-gray-500">
                {{ new Date(msg.createdAt).toLocaleString() }}
              </td>
              <td class="p-4 align-top">
                <div class="font-semibold text-gray-900">{{ msg.name }}</div>
                <div class="text-sm text-gray-500 hover:text-royalBlue">
                  <a :href="`mailto:${msg.email}`">{{ msg.email }}</a>
                </div>
              </td>
              <td class="p-4 align-top font-medium text-gray-900 max-w-xs truncate">
                {{ msg.subject }}
              </td>
              <td class="p-4 align-top text-gray-600 text-sm max-w-md">
                <div class="whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                  {{ msg.message }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useApi } from '~/composables/useApi';
import { useNuxtApp } from '#app';
import { useToast } from '#imports';

const { apiClient } = useApi();
const { showToast } = useToast();

const contacts = ref<any[]>([]);
const pending = ref(true);
const error = ref(false);

onMounted(async () => {
  try {
    const res = await apiClient.get('/contacts');
    contacts.value = res.data.data || res.data;
  } catch (err) {
    console.error('Error fetching contacts:', err);
    error.value = true;
  } finally {
    pending.value = false;
  }
});

// Listen for WebSocket updates from backend
const { $latestUpdate } = useNuxtApp();

watch(() => $latestUpdate?.value, (update) => {
  if (update && update.type === 'contactRequest') {
    // Prepend the new contact request
    contacts.value.unshift(update.data);
    showToast('New Contact Request received!', 'success');
  }
}, { deep: true });
</script>
