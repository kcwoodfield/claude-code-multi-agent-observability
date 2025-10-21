<script setup lang="ts">
import { DialogRoot, type DialogRootEmits, type DialogRootProps } from 'radix-vue'

interface Props extends DialogRootProps {}

const props = defineProps<Props>()
const emits = defineEmits<DialogRootEmits>()
</script>

<template>
  <DialogRoot v-bind="props" @update:open="emits['update:open']">
    <slot />
  </DialogRoot>
</template>
