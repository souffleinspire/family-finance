<template>
  <div class="card text-center">
    <p class="text-sm text-text-tertiary mb-1">{{ label }}</p>
    <p class="text-2xl font-semibold" :class="valueColor">¥{{ formatMoney(value) }}</p>
    <p v-if="change" class="text-xs mt-1" :class="changeColor">
      {{ change > 0 ? '↑' : '↓' }} {{ Math.abs(change) }}% vs 上月
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: {
    type: Number,
    default: 0
  },
  change: Number,
  color: {
    type: String,
    default: 'primary'
  }
})

const valueColor = computed(() => {
  const colors = {
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-chart-income'
  }
  return colors[props.color] || 'text-primary'
})

const changeColor = computed(() => {
  if (!props.change) return 'text-text-tertiary'
  return props.change > 0 ? 'text-primary' : 'text-accent'
})

function formatMoney(amount) {
  return Math.round(amount).toLocaleString()
}
</script>
