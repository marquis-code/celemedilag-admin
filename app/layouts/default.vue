<template>
  <div class="min-h-screen bg-gray-50 flex text-gray-800 font-body transition-colors duration-200 overflow-hidden">
    
    <!-- Mobile Overlay -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false" 
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="bg-white border-r border-gray-200 flex flex-col h-screen fixed lg:sticky top-0 shadow-sm z-40 transition-all duration-300 ease-in-out"
      :class="[
        isSidebarMinimized ? 'w-20' : 'w-64',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Sidebar Header -->
      <div class="h-16 flex items-center border-b border-gray-100 transition-all duration-300 relative" :class="isSidebarMinimized ? 'justify-center px-0' : 'px-6'">
        <Church class="h-7 w-7 text-royalBlue flex-shrink-0" :class="isSidebarMinimized ? 'mr-0' : 'mr-2'" />
        <h1 
          class="text-lg font-display font-bold text-gray-900 truncate tracking-tight transition-opacity duration-300"
          :class="isSidebarMinimized ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'"
        >
          Cele Medilag
        </h1>
        
        <!-- Mobile Close Button -->
        <button @click="isSidebarOpen = false" class="lg:hidden absolute right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-grow overflow-y-auto py-6 space-y-1" :class="isSidebarMinimized ? 'px-2' : 'px-4'">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="flex items-center py-3 rounded-xl transition-all duration-200 group relative"
          :class="[
            isSidebarMinimized ? 'px-0 justify-center' : 'px-4',
            route.path === item.path ? 'bg-blue-50 text-royalBlue shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          ]"
          :title="isSidebarMinimized ? item.name : ''"
        >
          <component 
            :is="item.icon" 
            class="h-5 w-5 transition-colors duration-200 flex-shrink-0" 
            :class="[
              route.path === item.path ? 'text-royalBlue' : 'text-gray-400 group-hover:text-gray-600',
              isSidebarMinimized ? 'mr-0' : 'mr-3'
            ]" 
          />
          
          <span 
            class="font-medium text-sm transition-opacity duration-300"
            :class="isSidebarMinimized ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'"
          >
            {{ item.name }}
          </span>
          
          <!-- Active Indicator -->
          <div v-if="route.path === item.path" class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-royalBlue rounded-r-full"></div>
        </NuxtLink>
      </nav>

      <!-- Minimize Toggle (Desktop Only) -->
      <button 
        @click="isSidebarMinimized = !isSidebarMinimized" 
        class="hidden lg:flex items-center justify-center p-3 border-t border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <ChevronRight v-if="isSidebarMinimized" class="w-5 h-5" />
        <ChevronLeft v-else class="w-5 h-5" />
      </button>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-100 bg-gray-50/50">
        <div 
          class="flex items-center rounded-lg hover:bg-white transition cursor-pointer"
          :class="isSidebarMinimized ? 'justify-center p-1' : 'p-2'"
          @click="confirmLogout"
          :title="isSidebarMinimized ? 'Log Out' : ''"
        >
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-royalBlue to-skyBlue text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0" :class="isSidebarMinimized ? 'mr-0' : 'mr-3'">
            SA
          </div>
          <div class="flex-grow min-w-0 transition-opacity duration-300" :class="isSidebarMinimized ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'">
            <p class="text-sm font-bold text-gray-900 truncate">Super Admin</p>
            <p class="text-xs text-gray-500 truncate">admin@celemedilag.org</p>
          </div>
          <LogOut 
            class="w-5 h-5 text-gray-400 hover:text-red-500 transition flex-shrink-0" 
            :class="isSidebarMinimized ? 'hidden' : 'block'"
          />
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out">
      
      <!-- Top Header -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20 shadow-sm transition-colors duration-200">
        <div class="flex items-center">
          <!-- Mobile Menu Button -->
          <button @click="isSidebarOpen = true" class="lg:hidden p-2 mr-3 text-gray-500 hover:text-royalBlue transition-colors rounded-lg hover:bg-gray-50">
            <Menu class="h-6 w-6" />
          </button>
          <h2 class="text-xl font-display font-bold text-gray-800 truncate">{{ pageTitle }}</h2>
        </div>
        
        <div class="flex items-center space-x-4">
          <button class="text-gray-500 hover:text-royalBlue transition-colors p-2 rounded-full hover:bg-gray-100 relative">
            <Bell class="h-5 w-5" />
            <span class="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      <!-- Page View -->
      <div class="p-4 sm:p-6 lg:p-8 flex-grow overflow-y-auto">
        <slot />
      </div>
    </main>

    <!-- Logout Confirmation Modal -->
    <ConfirmModal
      :isOpen="isLogoutModalOpen"
      title="Ready to leave?"
      message="Are you sure you want to log out of the admin dashboard? You will need to sign in again to access these controls."
      type="logout"
      confirmText="Log out"
      @confirm="executeLogout"
      @cancel="isLogoutModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmModal from '~/components/ConfirmModal.vue'
import { 
  LayoutDashboard, 
  Home, 
  BookOpen, 
  Phone, 
  Calendar, 
  Newspaper, 
  Headphones, 
  Image as ImageIcon, 
  Network, 
  Users,
  GraduationCap,
  LogOut,
  Bell,
  Settings,
  Church,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Mail
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const isSidebarOpen = ref(false)
const isSidebarMinimized = ref(false)
const isLogoutModalOpen = ref(false)

// Close mobile sidebar on route change
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

const confirmLogout = () => {
  isLogoutModalOpen.value = true
}

const executeLogout = () => {
  // Clear any auth tokens here if needed
  isLogoutModalOpen.value = false
  router.push('/login')
}

const pageTitle = computed(() => {
  if (route.path === '/admin') return 'Dashboard Overview'
  const pathPart = route.path.split('/').pop()
  if (pathPart) {
    return pathPart.charAt(0).toUpperCase() + pathPart.slice(1)
  }
  return ''
})

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Website Content', path: '/admin/content', icon: BookOpen },
  { name: 'Events', path: '/admin/events', icon: Calendar },
  { name: 'News & Blog', path: '/admin/news', icon: Newspaper },
  { name: 'Sermons', path: '/admin/sermons', icon: Headphones },
  { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  { name: 'Departments', path: '/admin/departments', icon: Network },
  { name: 'Leadership', path: '/admin/leadership', icon: Users },
  { name: 'Alumni', path: '/admin/alumni', icon: GraduationCap },
  { name: 'Contact', path: '/admin/contact', icon: Phone },
  { name: 'Contact Requests', path: '/admin/contacts', icon: Mail },
]
</script>
