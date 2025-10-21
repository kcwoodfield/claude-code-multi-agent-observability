<template>
  <Dialog :open="isOpen" @update:open="(open) => !open && close()">
    <DialogContent class="max-w-[85vw] h-[85vh] mobile:max-w-full mobile:h-full flex flex-col p-0">
      <DialogHeader class="flex-shrink-0 border-b p-6 mobile:p-3">
        <DialogTitle class="text-3xl mobile:text-lg">
          💬 Chat Transcript
        </DialogTitle>
            
        <!-- Search and Filters -->
        <div class="space-y-4 mt-4">
          <!-- Search Input -->
          <div class="flex gap-2">
            <div class="relative flex-1">
              <Input
                v-model="searchQuery"
                @keyup.enter="executeSearch"
                type="text"
                placeholder="Search transcript..."
                class="pl-10 mobile:pl-8 text-lg mobile:text-base"
              />
              <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Button
              @click="executeSearch"
              class="min-w-[44px] min-h-[44px]"
            >
              Search
            </Button>
            <Button
              @click="copyAllMessages"
              variant="secondary"
              class="min-w-[44px] min-h-[44px]"
              :title="'Copy all messages as JSON'"
            >
              {{ copyAllButtonText }}
            </Button>
          </div>
              
          <!-- Filters -->
          <div class="flex flex-wrap gap-2 mobile:gap-1 max-h-24 mobile:max-h-32 overflow-y-auto p-2 mobile:p-1 bg-muted rounded-lg mobile:overflow-x-auto mobile:pb-2">
            <Button
              v-for="filter in filters"
              :key="filter.type"
              @click="toggleFilter(filter.type)"
              :variant="activeFilters.includes(filter.type) ? 'default' : 'outline'"
              size="sm"
              class="rounded-full min-h-[44px] mobile:min-h-[36px] whitespace-nowrap"
            >
              <span class="mr-1">{{ filter.icon }}</span>
              {{ filter.label }}
            </Button>

            <!-- Clear Filters -->
            <Button
              v-if="searchQuery || activeSearchQuery || activeFilters.length > 0"
              @click="clearSearch"
              variant="destructive"
              size="sm"
              class="rounded-full min-h-[44px] mobile:min-h-[36px] whitespace-nowrap"
            >
              Clear All
            </Button>
          </div>
              
          <!-- Results Count -->
          <div v-if="activeSearchQuery || activeFilters.length > 0" class="text-sm mobile:text-xs text-muted-foreground">
            Showing {{ filteredChat.length }} of {{ chat.length }} messages
            <span v-if="activeSearchQuery" class="ml-2 mobile:block mobile:ml-0 mobile:mt-1">
              (searching for "{{ activeSearchQuery }}")
            </span>
          </div>
        </div>
      </DialogHeader>

      <!-- Content -->
      <ScrollArea class="flex-1 p-6 mobile:p-3">
        <ChatTranscript :chat="filteredChat" />
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import ChatTranscript from './ChatTranscript.vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Input, ScrollArea } from '@/components/ui';

const props = defineProps<{
  isOpen: boolean;
  chat: any[];
}>();

const emit = defineEmits<{
  close: [];
}>();

const searchQuery = ref('');
const activeSearchQuery = ref('');
const activeFilters = ref<string[]>([]);
const copyAllButtonText = ref('📋 Copy All');

const filters = [
  // Message types
  { type: 'user', label: 'User', icon: '👤' },
  { type: 'assistant', label: 'Assistant', icon: '🤖' },
  { type: 'system', label: 'System', icon: '⚙️' },
  
  // Tool actions
  { type: 'tool_use', label: 'Tool Use', icon: '🔧' },
  { type: 'tool_result', label: 'Tool Result', icon: '✅' },
  
  // Specific tools
  { type: 'Read', label: 'Read', icon: '📄' },
  { type: 'Write', label: 'Write', icon: '✍️' },
  { type: 'Edit', label: 'Edit', icon: '✏️' },
  { type: 'Glob', label: 'Glob', icon: '🔎' },
];

const toggleFilter = (type: string) => {
  const index = activeFilters.value.indexOf(type);
  if (index > -1) {
    activeFilters.value.splice(index, 1);
  } else {
    activeFilters.value.push(type);
  }
};

const executeSearch = () => {
  activeSearchQuery.value = searchQuery.value;
};

const clearSearch = () => {
  searchQuery.value = '';
  activeSearchQuery.value = '';
  activeFilters.value = [];
};

const close = () => {
  emit('close');
};

const copyAllMessages = async () => {
  try {
    // Copy all chat messages as formatted JSON
    const jsonPayload = JSON.stringify(props.chat, null, 2);
    await navigator.clipboard.writeText(jsonPayload);
    
    copyAllButtonText.value = '✅ Copied!';
    setTimeout(() => {
      copyAllButtonText.value = '📋 Copy All';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy all messages:', err);
    copyAllButtonText.value = '❌ Failed';
    setTimeout(() => {
      copyAllButtonText.value = '📋 Copy All';
    }, 2000);
  }
};

const matchesSearch = (item: any, query: string): boolean => {
  const lowerQuery = query.toLowerCase().trim();
  
  // Check direct content (for system messages and simple chat)
  if (typeof item.content === 'string') {
    // Remove ANSI codes before searching
    const cleanContent = item.content.replace(/\u001b\[[0-9;]*m/g, '').toLowerCase();
    if (cleanContent.includes(lowerQuery)) {
      return true;
    }
  }
  
  // Check role in simple format
  if (item.role && item.role.toLowerCase().includes(lowerQuery)) {
    return true;
  }
  
  // Check message object (complex format)
  if (item.message) {
    // Check message role
    if (item.message.role && item.message.role.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // Check message content
    if (item.message.content) {
      if (typeof item.message.content === 'string' && item.message.content.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      // Check array content
      if (Array.isArray(item.message.content)) {
        for (const content of item.message.content) {
          if (content.text && content.text.toLowerCase().includes(lowerQuery)) {
            return true;
          }
          if (content.name && content.name.toLowerCase().includes(lowerQuery)) {
            return true;
          }
          if (content.input && JSON.stringify(content.input).toLowerCase().includes(lowerQuery)) {
            return true;
          }
          if (content.content && typeof content.content === 'string' && content.content.toLowerCase().includes(lowerQuery)) {
            return true;
          }
        }
      }
    }
  }
  
  // Check type
  if (item.type && item.type.toLowerCase().includes(lowerQuery)) {
    return true;
  }
  
  // Check parentUuid, uuid, sessionId
  if (item.uuid && item.uuid.toLowerCase().includes(lowerQuery)) {
    return true;
  }
  if (item.sessionId && item.sessionId.toLowerCase().includes(lowerQuery)) {
    return true;
  }
  
  // Check toolUseResult
  if (item.toolUseResult) {
    if (JSON.stringify(item.toolUseResult).toLowerCase().includes(lowerQuery)) {
      return true;
    }
  }
  
  return false;
};

const matchesFilters = (item: any): boolean => {
  if (activeFilters.value.length === 0) return true;
  
  // Check message type
  if (item.type && activeFilters.value.includes(item.type)) {
    return true;
  }
  
  // Check role (simple format)
  if (item.role && activeFilters.value.includes(item.role)) {
    return true;
  }
  
  // Check for system messages with hook types
  if (item.type === 'system' && item.content) {
    // Extract hook type from system content (e.g., "PreToolUse:Read")
    const hookMatch = item.content.match(/([A-Za-z]+):/)?.[1];
    if (hookMatch && activeFilters.value.includes(hookMatch)) {
      return true;
    }
    // Also check if content contains "Running"
    if (item.content.includes('Running') && activeFilters.value.includes('Running')) {
      return true;
    }
    // Check for specific tool names in system messages
    const toolNames = ['Read', 'Write', 'Edit', 'Glob'];
    for (const tool of toolNames) {
      if (item.content.includes(tool) && activeFilters.value.includes(tool)) {
        return true;
      }
    }
  }
  
  // Check for command messages
  if (item.message?.content && typeof item.message.content === 'string') {
    if (item.message.content.includes('<command-') && activeFilters.value.includes('command')) {
      return true;
    }
  }
  
  // Check for meta messages
  if (item.isMeta && activeFilters.value.includes('meta')) {
    return true;
  }
  
  // Check for tool use in content
  if (item.message?.content && Array.isArray(item.message.content)) {
    for (const content of item.message.content) {
      if (content.type === 'tool_use') {
        if (activeFilters.value.includes('tool_use')) {
          return true;
        }
        // Check for specific tool names
        if (content.name && activeFilters.value.includes(content.name)) {
          return true;
        }
      }
      if (content.type === 'tool_result' && activeFilters.value.includes('tool_result')) {
        return true;
      }
    }
  }
  
  return false;
};

const filteredChat = computed(() => {
  if (!activeSearchQuery.value && activeFilters.value.length === 0) {
    return props.chat;
  }
  
  return props.chat.filter(item => {
    const matchesQueryCondition = !activeSearchQuery.value || matchesSearch(item, activeSearchQuery.value);
    const matchesFilterCondition = matchesFilters(item);
    return matchesQueryCondition && matchesFilterCondition;
  });
});

// Handle ESC key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    close();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});

// Reset search when modal closes
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    clearSearch();
  }
});

</script>