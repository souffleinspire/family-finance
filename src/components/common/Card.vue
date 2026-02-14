<template>
  <div class="card" :class="{ 'card-hover': hover }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  hover: {
    type: Boolean,
    default: false
  }
})
</script>
