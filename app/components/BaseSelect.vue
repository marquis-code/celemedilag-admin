<template>
  <div class="w-full relative" ref="dropdownRef">
    <label v-if="label" class="block text-sm font-semibold mb-1.5 transition-colors text-gray-700">
      {{ label }}
    </label>
    
    <!-- Trigger Button -->
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="appearance-none flex items-center justify-between w-full px-4 py-3.5 rounded-xl border bg-white transition-all duration-200 focus:outline-none focus:ring-2 text-base border-gray-200 text-gray-900 focus:ring-royalBlue/20 focus:border-royalBlue cursor-pointer"
      :class="{ 'text-gray-400': !selectedLabel }"
    >
      <span class="truncate">{{ selectedLabel || placeholder }}</span>
      <ChevronDown class="h-4 w-4 text-gray-500 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto"
      >
        <ul class="py-1">
          <li
            v-for="opt in options"
            :key="opt.value"
            @click="selectOption(opt.value)"
            class="px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between"
            :class="modelValue === opt.value ? 'bg-blue-50/50 text-royalBlue font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
          >
            <span>{{ opt.label }}</span>
            <Check v-if="modelValue === opt.value" class="w-4 h-4 text-royalBlue" />
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  modelValue: { type: [String, Number], required: true },
  label: { type: String, default: '' },
  options: { type: Array as () => Array<{ label: string, value: any }>, required: true },
  placeholder: { type: String, default: 'Select an option' }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropdownRef = ref(null)

onClickOutside(dropdownRef, () => {
  isOpen.value = false
})

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : ''
})

const selectOption = (value: any) => {
  emit('update:modelValue', value)
  isOpen.value = false
}
</script>
