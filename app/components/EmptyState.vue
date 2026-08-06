<template>
  <div class="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border shadow-sm transition-all duration-200" :class="isError ? 'border-red-100' : 'border-gray-100'">
    <div 
      class="w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-colors"
      :class="isError ? 'bg-red-50' : 'bg-gray-50'"
    >
      <slot name="icon">
        <AlertTriangle v-if="isError" class="w-12 h-12 text-red-400" />
        <Database v-else class="w-12 h-12 text-gray-400" />
      </slot>
    </div>
    <h3 
      class="text-xl font-display font-bold mb-2"
      :class="isError ? 'text-red-900' : 'text-gray-900'"
    >
      {{ title }}
    </h3>
    <p 
      class="max-w-md mb-8 leading-relaxed"
      :class="isError ? 'text-red-500' : 'text-gray-500'"
    >
      {{ description }}
    </p>
    <button v-if="actionText" @click="$emit('action')" class="bg-royalBlue text-white px-6 py-2.5 rounded-xl font-medium hover:bg-skyBlue transition shadow-sm flex items-center">
      <RotateCcw v-if="isError" class="w-4 h-4 mr-2" />
      <Plus v-else class="w-5 h-5 mr-2" />
      {{ actionText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { Database, Plus, AlertTriangle, RotateCcw } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  actionText: {
    type: String,
    default: ''
  },
  isError: {
    type: Boolean,
    default: false
  }
})

defineEmits(['action'])
</script>
