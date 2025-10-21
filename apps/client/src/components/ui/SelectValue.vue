<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { SelectValue, type SelectValueProps } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props extends SelectValueProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <SelectValue v-bind="props" :class="cn(props.class)">
    <slot />
  </SelectValue>
</template>
