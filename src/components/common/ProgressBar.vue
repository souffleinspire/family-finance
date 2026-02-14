<template>
  <div class="w-full">
    <div v-if="showLabel" class="flex items-center justify-between mb-2">
      <slot name="label" />
      <span class="text-sm font-medium" :class="colorClass">{{ percentage.toFixed(0) }}%</span>
    </div>
    <div class="h-2 bg-border-light rounded-full overflow-hidden">
      <div 
        class="h-full rounded-full transition-all duration-500"
        :class="colorClass"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentage: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  },
  showLabel: {
    type: Boolean,
    default: true
  }
})

const colorClass = computed(() => {
  const colors = {
    primary: 'bg-primary',
    accent: 'bg-accent',
    success: 'bg-chart-income'
  }
  return colors[props.color] || 'bg-primary'
})
</script>
