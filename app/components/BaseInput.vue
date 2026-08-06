<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-semibold mb-1.5 transition-colors" :class="error ? 'text-red-500' : 'text-gray-700'">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <div v-if="$slots.leading" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <slot name="leading" />
      </div>
      <input
        ref="inputRef"
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="appearance-none block w-full px-4 py-3.5 rounded-xl border bg-white transition-all duration-200 focus:outline-none focus:ring-2 text-base"
        :class="[
          $slots.leading ? 'pl-10' : '',
          $slots.trailing ? 'pr-10' : '',
          error 
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500/20 focus:border-red-500' 
            : 'border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-royalBlue/20 focus:border-royalBlue'
        ]"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
      />
      <div v-if="$slots.trailing" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
        <slot name="trailing" />
      </div>
    </div>
    <p v-if="error" class="mt-1.5 text-sm text-red-500 font-medium">{{ error }}</p>
    <p v-else-if="helpText" class="mt-1.5 text-sm text-gray-500">{{ helpText }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  helpText: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const id = computed(() => `input-${Math.random().toString(36).substring(2, 9)}`)
const inputRef = ref<HTMLInputElement | null>(null)
let fpInstance: any = null

onMounted(async () => {
  if (inputRef.value && (props.type === 'date' || props.type === 'time')) {
    // Dynamically import flatpickr and its CSS to avoid SSR issues
    const flatpickr = (await import('flatpickr')).default
    await import('flatpickr/dist/flatpickr.css')
    
    const config: any = {
      defaultDate: props.modelValue,
      onChange: (selectedDates: Date[], dateStr: string) => {
        emit('update:modelValue', dateStr)
      }
    }
    
    if (props.type === 'time') {
      config.enableTime = true
      config.noCalendar = true
      config.dateFormat = "H:i"
      config.time_24hr = false
    } else if (props.type === 'date') {
      config.dateFormat = "Y-m-d"
    }

    fpInstance = flatpickr(inputRef.value, config)
  }
})

watch(() => props.modelValue, (newVal) => {
  if (fpInstance) {
    fpInstance.setDate(newVal, false)
  }
})

onBeforeUnmount(() => {
  if (fpInstance) {
    fpInstance.destroy()
  }
})
</script>
