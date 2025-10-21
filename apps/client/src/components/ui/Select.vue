<script setup lang="ts">
import {
  SelectRoot,
  type SelectRootEmits,
  type SelectRootProps,
} from 'radix-vue'

interface Props extends SelectRootProps {}

const props = defineProps<Props>()
const emits = defineEmits<SelectRootEmits>()
</script>

<template>
  <SelectRoot v-bind="props" @update:modelValue="emits['update:modelValue']" @update:open="emits['update:open']">
    <slot />
  </SelectRoot>
</template>
