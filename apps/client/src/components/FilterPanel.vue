<template>
  <div class="bg-gradient-to-r from-[var(--theme-bg-primary)] to-[var(--theme-bg-secondary)] border-b-2 border-[var(--theme-primary)] px-3 py-4 mobile:py-2 shadow-lg">
    <div class="flex flex-wrap gap-3 items-center mobile:flex-col mobile:items-stretch">
      <div class="flex-1 min-w-0 mobile:w-full">
        <Label class="block text-base mobile:text-sm text-[var(--theme-primary)] mb-1.5 drop-shadow-sm">
          Source App
        </Label>
        <Select v-model="localFilters.sourceApp" @update:model-value="updateFilters">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Sources</SelectItem>
            <SelectItem v-for="app in filterOptions.source_apps" :key="app" :value="app">
              {{ app }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex-1 min-w-0 mobile:w-full">
        <Label class="block text-base mobile:text-sm text-[var(--theme-primary)] mb-1.5 drop-shadow-sm">
          Session ID
        </Label>
        <Select v-model="localFilters.sessionId" @update:model-value="updateFilters">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="All Sessions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Sessions</SelectItem>
            <SelectItem v-for="session in filterOptions.session_ids" :key="session" :value="session">
              {{ session.slice(0, 8) }}...
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex-1 min-w-0 mobile:w-full">
        <Label class="block text-base mobile:text-sm text-[var(--theme-primary)] mb-1.5 drop-shadow-sm">
          Event Type
        </Label>
        <Select v-model="localFilters.eventType" @update:model-value="updateFilters">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem v-for="type in filterOptions.hook_event_types" :key="type" :value="type">
              {{ type }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        v-if="hasActiveFilters"
        @click="clearFilters"
        variant="secondary"
        class="mobile:w-full"
      >
        Clear Filters
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { FilterOptions } from '../types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Label, Button } from '@/components/ui';

const props = defineProps<{
  filters: {
    sourceApp: string;
    sessionId: string;
    eventType: string;
  };
}>();

const emit = defineEmits<{
  'update:filters': [filters: typeof props.filters];
}>();

const filterOptions = ref<FilterOptions>({
  source_apps: [],
  session_ids: [],
  hook_event_types: []
});

const localFilters = ref({ ...props.filters });

const hasActiveFilters = computed(() => {
  return localFilters.value.sourceApp || localFilters.value.sessionId || localFilters.value.eventType;
});

const updateFilters = () => {
  emit('update:filters', { ...localFilters.value });
};

const clearFilters = () => {
  localFilters.value = {
    sourceApp: '',
    sessionId: '',
    eventType: ''
  };
  updateFilters();
};

const fetchFilterOptions = async () => {
  try {
    const response = await fetch('http://localhost:4000/events/filter-options');
    if (response.ok) {
      filterOptions.value = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch filter options:', error);
  }
};

onMounted(() => {
  fetchFilterOptions();
  // Refresh filter options periodically
  setInterval(fetchFilterOptions, 10000);
});
</script>