<template>
  <div class="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-skyBlue/20 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
      <div class="mx-auto w-16 h-16 bg-gradient-to-tr from-royalBlue to-skyBlue rounded-2xl flex items-center justify-center text-white font-bold font-display shadow-lg mb-6">
        <Church class="w-8 h-8" />
      </div>
      <h2 class="text-3xl font-extrabold text-gray-900 font-display tracking-tight">
        Welcome Back
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 font-medium">
        Sign in to the CELEMEDILAG Management System
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700">
              Email address
            </label>
            <div class="mt-2 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400" />
              </div>
              <input id="email" name="email" type="email" autocomplete="email" required v-model="email"
                class="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-skyBlue/20 focus:border-skyBlue sm:text-sm transition-all"
                placeholder="admin@celemedilag.org">
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div class="mt-2 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password"
                class="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-skyBlue/20 focus:border-skyBlue sm:text-sm transition-all"
                placeholder="••••••••">
            </div>
          </div>

          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                class="h-4 w-4 text-royalBlue focus:ring-royalBlue border-gray-300 rounded">
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-semibold text-skyBlue hover:text-royalBlue transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-royalBlue hover:bg-skyBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royalBlue transition-colors">
              Sign in
            </button>
          </div>
        </form>
      </div>
      <p class="text-center text-xs text-gray-400 mt-8 font-medium">
        &copy; {{ new Date().getFullYear() }} CELEMEDILAG. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Church, Mail, Lock } from 'lucide-vue-next'

const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = () => {
  // For now, bypass actual auth
  console.log('Login attempted with', email.value)
  router.push('/admin')
}

// Don't use the admin layout for the login page
definePageMeta({
  layout: false
})
</script>
