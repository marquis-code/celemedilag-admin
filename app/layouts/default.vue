<template>
  <div class="min-h-screen bg-gray-50 flex text-gray-800 font-body">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shadow-sm z-20 transition-all duration-300">
      <!-- Brand -->
      <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <div class="w-8 h-8 bg-royalBlue rounded-lg flex items-center justify-center text-white font-bold font-display mr-3 shadow-md">
          <Church class="w-5 h-5" />
        </div>
        <h2 class="text-xl font-display font-bold text-gray-900 tracking-tight">CELEMEDILAG</h2>
      </div>
      
      <div class="flex-grow overflow-y-auto py-6 px-4 space-y-8">
        
        <!-- Dashboard Overview -->
        <div>
          <NuxtLink to="/admin" class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group" active-class="bg-blue-50 text-royalBlue shadow-sm" :class="$route.path === '/admin' ? 'bg-blue-50 text-royalBlue shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
            <LayoutDashboard class="w-5 h-5 mr-3 transition-colors" :class="$route.path === '/admin' ? 'text-royalBlue' : 'text-gray-400 group-hover:text-gray-600'" />
            Dashboard
          </NuxtLink>
        </div>

        <!-- Content Management -->
        <div>
          <h3 class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Content Management</h3>
          <nav class="space-y-1">
            <NuxtLink to="/admin/home" class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group" active-class="bg-blue-50 text-royalBlue" :class="['text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
              <Home class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" :class="{ 'text-royalBlue': $route.path === '/admin/home' }" />
              Home Page
            </NuxtLink>
            <NuxtLink to="/admin/about" class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group" active-class="bg-blue-50 text-royalBlue" :class="['text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
              <BookOpen class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" :class="{ 'text-royalBlue': $route.path === '/admin/about' }" />
              About Us
            </NuxtLink>
            <NuxtLink to="/admin/contact" class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group" active-class="bg-blue-50 text-royalBlue" :class="['text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
              <Phone class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" :class="{ 'text-royalBlue': $route.path === '/admin/contact' }" />
              Contact Info
            </NuxtLink>
          </nav>
        </div>

        <!-- Modules -->
        <div>
          <h3 class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Modules</h3>
          <nav class="space-y-1">
            <NuxtLink to="/admin/events" class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group" active-class="bg-blue-50 text-royalBlue" :class="['text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
              <Calendar class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" :class="{ 'text-royalBlue': $route.path === '/admin/events' }" />
              Events & Programs
            </NuxtLink>
            <NuxtLink to="/admin/news" class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group" active-class="bg-blue-50 text-royalBlue" :class="['text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
              <Newspaper class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" :class="{ 'text-royalBlue': $route.path === '/admin/news' }" />
              News & Blog
            </NuxtLink>
            <NuxtLink to="/admin/sermons" class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group" active-class="bg-blue-50 text-royalBlue" :class="['text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
              <Headphones class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" :class="{ 'text-royalBlue': $route.path === '/admin/sermons' }" />
              Sermons & Resources
            </NuxtLink>
            <NuxtLink to="/admin/gallery" class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group" active-class="bg-blue-50 text-royalBlue" :class="['text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
              <Image class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" :class="{ 'text-royalBlue': $route.path === '/admin/gallery' }" />
              Gallery
            </NuxtLink>
          </nav>
        </div>

        <!-- Organization -->
        <div>
          <h3 class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Organization</h3>
          <nav class="space-y-1">
            <NuxtLink to="/admin/departments" class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group" active-class="bg-blue-50 text-royalBlue" :class="['text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
              <Network class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" :class="{ 'text-royalBlue': $route.path === '/admin/departments' }" />
              Departments
            </NuxtLink>
            <NuxtLink to="/admin/leadership" class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group" active-class="bg-blue-50 text-royalBlue" :class="['text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
              <Users class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" :class="{ 'text-royalBlue': $route.path === '/admin/leadership' }" />
              Leadership
            </NuxtLink>
            <NuxtLink to="/admin/alumni" class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group" active-class="bg-blue-50 text-royalBlue" :class="['text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
              <GraduationCap class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" :class="{ 'text-royalBlue': $route.path === '/admin/alumni' }" />
              Alumni Network
            </NuxtLink>
          </nav>
        </div>
      </div>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-100 bg-gray-50/50">
        <div class="flex items-center p-2 rounded-lg hover:bg-white transition cursor-pointer">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-royalBlue to-skyBlue text-white flex items-center justify-center font-bold text-sm shadow-sm mr-3">
            SA
          </div>
          <div class="flex-grow min-w-0">
            <p class="text-sm font-bold text-gray-900 truncate">Super Admin</p>
            <p class="text-xs text-gray-500 truncate">admin@celemedilag.org</p>
          </div>
          <LogOut class="w-5 h-5 text-gray-400 hover:text-red-500 transition" />
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col min-w-0 bg-[#F8FAFC]">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm/50">
        <div class="flex items-center">
          <h1 class="text-xl font-display font-bold text-gray-800 capitalize">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center space-x-5">
          <button class="relative text-gray-400 hover:text-gray-600 transition">
            <Bell class="w-6 h-6" />
            <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button class="text-gray-400 hover:text-gray-600 transition">
            <Settings class="w-6 h-6" />
          </button>
        </div>
      </header>
      
      <!-- Page View -->
      <div class="p-8 flex-grow overflow-y-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  LayoutDashboard, 
  Home, 
  BookOpen, 
  Phone, 
  Calendar, 
  Newspaper, 
  Headphones, 
  Image, 
  Network, 
  Users, 
  GraduationCap, 
  LogOut, 
  Bell, 
  Settings,
  Church
} from 'lucide-vue-next'

const route = useRoute()

const pageTitle = computed(() => {
  if (route.path === '/admin') return 'Dashboard Overview'
  const pathPart = route.path.split('/').pop()
  if (!pathPart) return 'Dashboard'
  return pathPart.replace(/-/g, ' ')
})
</script>
