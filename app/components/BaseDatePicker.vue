<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-semibold mb-1.5 transition-colors text-gray-700">
      {{ label }}
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Calendar class="h-5 w-5" />
      </div>
      <input
        ref="dateInput"
        type="text"
        :value="modelValue"
        class="appearance-none block w-full pl-10 pr-4 py-3.5 rounded-xl border bg-white transition-all duration-200 focus:outline-none focus:ring-2 text-base border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue"
        :placeholder="placeholder"
        readonly
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Calendar } from 'lucide-vue-next'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Select Date' },
  enableTime: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const dateInput = ref<HTMLInputElement | null>(null)
let fpInstance: flatpickr.Instance | null = null

onMounted(() => {
  if (dateInput.value) {
    fpInstance = flatpickr(dateInput.value, {
      defaultDate: props.modelValue,
      enableTime: props.enableTime,
      dateFormat: props.enableTime ? "Y-m-d H:i" : "Y-m-d",
      onChange: (selectedDates, dateStr) => {
        emit('update:modelValue', dateStr)
      }
    })
  }
})

watch(() => props.modelValue, (newVal) => {
  if (fpInstance && newVal !== dateInput.value?.value) {
    fpInstance.setDate(newVal)
  }
})

onUnmounted(() => {
  if (fpInstance) fpInstance.destroy()
})
</script>

<style scoped>
/* Empty style block to fix Vite HMR cache desync */
</style>
