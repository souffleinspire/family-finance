<template>
  <button 
    class="btn-primary"
    :class="{ 'btn-secondary': variant === 'secondary', 'btn-accent': variant === 'accent' }"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'accent'].includes(v)
  },
  disabled: Boolean
})
</script>
