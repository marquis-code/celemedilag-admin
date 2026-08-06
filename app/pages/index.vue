<template>
  <div class="space-y-8">
    <!-- Welcome Header -->
    <div class="flex items-center justify-between">
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
            <span class="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp class="w-3 h-3 mr-1" /> +2
            </span>
          </div>
          <div>
            <h3 class="text-3xl font-bold text-gray-900 mb-1">12</h3>
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
            <span class="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp class="w-3 h-3 mr-1" /> +5
            </span>
          </div>
          <div>
            <h3 class="text-3xl font-bold text-gray-900 mb-1">45</h3>
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
            <span class="flex items-center text-sm font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              <Minus class="w-3 h-3 mr-1" /> 0
            </span>
          </div>
          <div>
            <h3 class="text-3xl font-bold text-gray-900 mb-1">28</h3>
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
            <span class="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp class="w-3 h-3 mr-1" /> +12
            </span>
          </div>
          <div>
            <h3 class="text-3xl font-bold text-gray-900 mb-1">156</h3>
            <p class="text-gray-500 font-medium">Registered Alumni</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Activity -->
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-lg text-gray-900 flex items-center">
            <Activity class="w-5 h-5 mr-2 text-royalBlue" />
            Recent Activity
          </h3>
          <button class="text-sm font-medium text-skyBlue hover:underline">View All</button>
        </div>
        <div class="p-6">
          <div class="space-y-6">
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-royalBlue mr-4 flex-shrink-0">
                <Calendar class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">New event created: <span class="font-bold">Annual Academic Symposium</span></p>
                <p class="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mr-4 flex-shrink-0">
                <Headphones class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Sermon uploaded: <span class="font-bold">The Power of Praise</span> by Dr. Emmanuel Ojo</p>
                <p class="text-xs text-gray-500 mt-1">5 hours ago</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mr-4 flex-shrink-0">
                <UserPlus class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">New Alumnus Registration: <span class="font-bold">Dr. Sarah Cole</span></p>
                <p class="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
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
            <div class="flex items-center p-3 rounded-xl border border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition group cursor-pointer">
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:text-amber-500 transition mr-3">
                <Edit3 class="w-5 h-5" />
              </div>
              <div>
                <p class="font-bold text-sm text-gray-900 group-hover:text-amber-600 transition">Post News Article</p>
                <p class="text-xs text-gray-500">Publish to the blog</p>
              </div>
            </div>
            <div class="flex items-center p-3 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition group cursor-pointer">
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:text-purple-600 transition mr-3">
                <Upload class="w-5 h-5" />
              </div>
              <div>
                <p class="font-bold text-sm text-gray-900 group-hover:text-purple-700 transition">Upload Sermon</p>
                <p class="text-xs text-gray-500">Add an audio/video resource</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Calendar, 
  Headphones, 
  Newspaper, 
  GraduationCap, 
  TrendingUp, 
  Minus, 
  CalendarDays,
  Activity,
  UserPlus,
  Zap,
  Plus,
  Edit3,
  Upload
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin'
})
</script>
