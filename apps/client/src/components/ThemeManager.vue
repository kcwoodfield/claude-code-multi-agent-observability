<template>
  <Dialog :open="isOpen" @update:open="(open) => !open && close()">
    <DialogContent class="max-w-[75vw] h-[75vh] flex flex-col p-0">
      <DialogHeader class="flex-shrink-0 border-b p-6">
        <DialogTitle class="text-3xl">
          🎨 Theme Manager
        </DialogTitle>
      </DialogHeader>

      <!-- Content -->
      <ScrollArea class="flex-1 p-6">
        <!-- Theme Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div
            v-for="theme in predefinedThemes"
            :key="theme.name"
            @click="selectTheme(theme.name)"
            :class="[
              'cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md',
              currentTheme === theme.name
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            <!-- Theme Preview -->
            <div class="flex h-16 rounded-md overflow-hidden mb-3">
              <div
                class="flex-1"
                :style="{ backgroundColor: theme.preview.primary }"
              ></div>
              <div
                class="flex-1"
                :style="{ backgroundColor: theme.preview.secondary }"
              ></div>
              <div
                class="flex-1"
                :style="{ backgroundColor: theme.preview.accent }"
              ></div>
            </div>

            <!-- Theme Info -->
            <h3 class="text-gray-900 dark:text-white">{{ theme.displayName }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ theme.description }}</p>

            <!-- Current indicator -->
            <div v-if="currentTheme === theme.name" class="mt-2">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Current
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ predefinedThemes.length }} themes available
          </div>
          <Button
            @click="close"
            variant="secondary"
          >
            Close
          </Button>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemes } from '../composables/useThemes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, ScrollArea } from '@/components/ui';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Theme management
const { state, predefinedThemes, setTheme } = useThemes();

// Computed properties
const currentTheme = computed(() => state.value.currentTheme);

// Methods
const selectTheme = (themeName: string) => {
  setTheme(themeName);
  close();
};

const close = () => {
  emit('close');
};
</script>