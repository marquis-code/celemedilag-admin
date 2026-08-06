<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-[100] transition-opacity">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
      <div class="p-6 text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4" :class="iconBgClass">
          <component :is="iconComponent" class="h-8 w-8" :class="iconColorClass" />
        </div>
        <h3 class="text-xl font-display font-bold text-gray-900 mb-2">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-500 mb-8 px-2">
          {{ message }}
        </p>
        <div class="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button @click="$emit('cancel')" class="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors w-full sm:w-1/2">
            {{ cancelText }}
          </button>
          <button @click="$emit('confirm')" class="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors shadow-sm w-full sm:w-1/2 flex items-center justify-center" :class="confirmBtnClass" :disabled="loading">
            <span v-if="loading" class="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, AlertCircle, Info, LogOut } from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String as () => 'danger' | 'warning' | 'info' | 'logout', default: 'warning' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  loading: { type: Boolean, default: false }
})

defineEmits(['confirm', 'cancel'])

const iconComponent = computed(() => {
  switch (props.type) {
    case 'danger': return AlertCircle
    case 'warning': return AlertTriangle
    case 'logout': return LogOut
    case 'info':
    default: return Info
  }
})

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'bg-red-100'
    case 'warning': return 'bg-orange-100'
    case 'logout': return 'bg-gray-100'
    case 'info':
    default: return 'bg-blue-100'
  }
})

const iconColorClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'text-red-600'
    case 'warning': return 'text-orange-600'
    case 'logout': return 'text-gray-600'
    case 'info':
    default: return 'text-blue-600'
  }
})

const confirmBtnClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'bg-red-600 hover:bg-red-700 disabled:opacity-50'
    case 'warning': return 'bg-orange-500 hover:bg-orange-600 disabled:opacity-50'
    case 'logout': return 'bg-gray-900 hover:bg-black disabled:opacity-50'
    case 'info':
    default: return 'bg-royalBlue hover:bg-skyBlue disabled:opacity-50'
  }
})
</script>
