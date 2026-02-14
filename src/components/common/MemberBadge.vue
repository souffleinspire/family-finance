<template>
  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-secondary">
    <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
      <span class="text-primary text-xs font-medium">{{ name.charAt(0) }}</span>
    </div>
    <span class="text-sm text-text-primary">{{ name }}</span>
  </div>
</template>

<script setup>
defineProps({
  name: String
})
</script>
