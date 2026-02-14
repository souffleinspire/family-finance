<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30" @click.self="close">
    <div class="w-full max-w-md bg-bg-tertiary rounded-2xl shadow-soft-lg p-6 animate-scale-in">
      <div v-if="title" class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-text-primary">{{ title }}</h3>
        <button @click="close" class="p-1 rounded-full hover:bg-bg-secondary">
          <svg class="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  show: Boolean,
  title: String
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

watch(() => props.show, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>
