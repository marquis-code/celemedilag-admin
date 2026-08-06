<template>
  <div class="space-y-8">
    <!-- Welcome Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-900">Welcome back, Admin 👋</h2>
        <p class="text-gray-500 mt-1">Here is what's happening across CELEMEDILAG today.</p>
      </div>
      <div class="flex items-center space-x-3">
        <span class="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center">
          <CalendarDays class="w-4 h-4 mr-2 text-skyBlue" />
          {{ new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) }}
        </span>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Events -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Calendar class="w-24 h-24 text-royalBlue" />
        </div>
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-royalBlue">
              <Calendar class="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 class="text-3xl font-bold text-gray-900 mb-1">
              <span v-if="pending" class="animate-pulse bg-gray-200 h-8 w-16 rounded block"></span>
              <span v-else>{{ stats?.events || 0 }}</span>
            </h3>
            <p class="text-gray-500 font-medium">Upcoming Events</p>
          </div>
        </div>
      </div>

      <!-- Sermons -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Headphones class="w-24 h-24 text-purple-600" />
        </div>
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Headphones class="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 class="text-3xl font-bold text-gray-900 mb-1">
              <span v-if="pending" class="animate-pulse bg-gray-200 h-8 w-16 rounded block"></span>
              <span v-else>{{ stats?.sermons || 0 }}</span>
            </h3>
            <p class="text-gray-500 font-medium">Sermons Uploaded</p>
          </div>
        </div>
      </div>

      <!-- News -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Newspaper class="w-24 h-24 text-amber-500" />
        </div>
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <Newspaper class="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 class="text-3xl font-bold text-gray-900 mb-1">
              <span v-if="pending" class="animate-pulse bg-gray-200 h-8 w-16 rounded block"></span>
              <span v-else>{{ stats?.news || 0 }}</span>
            </h3>
            <p class="text-gray-500 font-medium">News Articles</p>
          </div>
        </div>
      </div>

      <!-- Alumni -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <GraduationCap class="w-24 h-24 text-emerald-500" />
        </div>
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <GraduationCap class="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 class="text-3xl font-bold text-gray-900 mb-1">
              <span v-if="pending" class="animate-pulse bg-gray-200 h-8 w-16 rounded block"></span>
              <span v-else>{{ stats?.alumni || 0 }}</span>
            </h3>
            <p class="text-gray-500 font-medium">Registered Alumni</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Activity (Static for now, would require another endpoint) -->
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-lg text-gray-900 flex items-center">
            <Activity class="w-5 h-5 mr-2 text-royalBlue" />
            Recent Activity
          </h3>
          <button class="text-sm font-medium text-skyBlue hover:underline">View All</button>
        </div>
        <div class="p-6">
          <div class="space-y-6 text-gray-500 italic text-sm text-center">
            Recent activity timeline will appear here once connected to logs.
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="font-bold text-lg text-gray-900 flex items-center">
            <Zap class="w-5 h-5 mr-2 text-amber-500" />
            Quick Actions
          </h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 gap-3">
            <NuxtLink to="/admin/events" class="flex items-center p-3 rounded-xl border border-gray-200 hover:border-royalBlue hover:bg-blue-50 transition group cursor-pointer">
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:text-royalBlue transition mr-3">
                <Plus class="w-5 h-5" />
              </div>
              <div>
                <p class="font-bold text-sm text-gray-900 group-hover:text-royalBlue transition">Add New Event</p>
                <p class="text-xs text-gray-500">Schedule a new program</p>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/admin/news" class="flex items-center p-3 rounded-xl border border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition group cursor-pointer">
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:text-amber-500 transition mr-3">
                <Edit3 class="w-5 h-5" />
              </div>
              <div>
                <p class="font-bold text-sm text-gray-900 group-hover:text-amber-600 transition">Post News Article</p>
                <p class="text-xs text-gray-500">Publish to the blog</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/admin/sermons" class="flex items-center p-3 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition group cursor-pointer">
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:text-purple-600 transition mr-3">
                <Upload class="w-5 h-5" />
              </div>
              <div>
                <p class="font-bold text-sm text-gray-900 group-hover:text-purple-700 transition">Upload Sermon</p>
                <p class="text-xs text-gray-500">Add an audio/video resource</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar, Headphones, Newspaper, GraduationCap, TrendingUp, Minus, CalendarDays, Activity, UserPlus, Zap, Plus, Edit3, Upload } from 'lucide-vue-next'

const { useStatsApi } = useApi()

const stats = ref<any>({ events: 0, sermons: 0, news: 0, alumni: 0 })
const pending = ref(true)

onMounted(async () => {
  try {
    stats.value = await useStatsApi()
  } catch (err) {
    console.error('Failed to load stats', err)
  } finally {
    pending.value = false
  }
})
</script>
