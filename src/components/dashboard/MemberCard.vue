<template>
  <div class="flex items-center justify-between p-4 rounded-xl bg-bg-secondary">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
        <span class="text-primary font-medium">{{ member.name.charAt(0) }}</span>
      </div>
      <div>
        <p class="font-medium text-text-primary">{{ member.name }}</p>
        <p class="text-xs text-text-tertiary">
          收入 ¥{{ formatMoney(income) }} · 支出 ¥{{ formatMoney(expense) }}
        </p>
      </div>
    </div>
    <div class="text-right">
      <p class="text-sm font-medium" :class="balance >= 0 ? 'text-primary' : 'text-accent'">
        {{ balance >= 0 ? '+' : '' }}¥{{ formatMoney(balance) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  member: {
    type: Object,
    required: true
  },
  income: {
    type: Number,
    default: 0
  },
  expense: {
    type: Number,
    default: 0
  }
})

const balance = computed(() => props.income - props.expense)

function formatMoney(amount) {
  return Math.round(amount).toLocaleString()
}
</script>
