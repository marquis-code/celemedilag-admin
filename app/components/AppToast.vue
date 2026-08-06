<template>
  <Transition name="toast">
    <div 
      v-if="toast.show" 
      class="fixed bottom-6 right-6 z-[9999] px-5 py-4 rounded-xl shadow-xl shadow-black/5 border flex items-center gap-3 w-80"
      :class="toast.type === 'success' ? 'bg-white border-emerald-100' : 'bg-white border-red-100'"
    >
      <div 
        class="p-2 rounded-full flex-shrink-0"
        :class="toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'"
      >
        <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5" />
        <AlertCircle v-else class="w-5 h-5" />
      </div>
      <p class="font-medium text-sm text-gray-800 leading-snug">{{ toast.message }}</p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { CheckCircle2, AlertCircle } from 'lucide-vue-next'
const { toast } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
