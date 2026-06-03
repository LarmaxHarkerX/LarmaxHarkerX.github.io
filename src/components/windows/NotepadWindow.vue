<script setup lang="ts">
import { onMounted } from 'vue'
import Win3xIcon from '../shared/Win3xIcon.vue'
import { useMoments } from '../../composables/useMoments'

const { moments, ensureMomentsLoaded } = useMoments()

onMounted(() => {
  void ensureMomentsLoaded()
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: '2-digit'
  })
}
</script>

<template>
  <div class="notepad">
    <div class="win31-toolbar">
      <button type="button" class="win31-toolbar-button" title="Document" disabled>
        <Win3xIcon name="document" size="small" label="Document" />
      </button>
      <button type="button" class="win31-toolbar-button" title="Open Folder" disabled>
        <Win3xIcon name="folder" size="small" label="Open Folder" />
      </button>
      <button type="button" class="win31-toolbar-button" title="Save" disabled>
        <Win3xIcon name="save" size="small" label="Save" />
      </button>
      <div class="win31-toolbar-separator"></div>
      <button type="button" class="win31-toolbar-button" title="Cut" disabled>
        <Win3xIcon name="cut" size="small" label="Cut" />
      </button>
      <button type="button" class="win31-toolbar-button" title="Copy" disabled>
        <Win3xIcon name="copy" size="small" label="Copy" />
      </button>
      <button type="button" class="win31-toolbar-button" title="Pin" disabled>
        <Win3xIcon name="pin" size="small" label="Pin" />
      </button>
    </div>
    
    <div class="np-content win31-pane win31-pane--scrollable">
      <div v-for="moment in moments" :key="moment.slug" class="moment-entry">
        <div class="entry-header">
          <span class="entry-date">{{ formatDate(moment.date) }}</span>
        </div>
        <div class="entry-content">
          <component :is="moment.component" v-if="moment.component" />
        </div>
        <div class="entry-tags">
          <span v-for="tag in moment.tags" :key="tag" class="entry-tag">#{{ tag }}</span>
        </div>
        <div class="entry-separator">────────────────────────────────</div>
      </div>
    </div>
    
    <div class="np-status win31-statusbar">
      <span>{{ moments.length }} entries</span>
    </div>
  </div>
</template>

<style scoped>
.notepad {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.np-content {
  flex: 1;
  padding: 8px;
}

.moment-entry {
  margin-bottom: 12px;
}

.entry-header {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}

.entry-date {
  color: #808080;
  font-size: 11px;
}

.entry-content {
  margin-bottom: 4px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 12px;
  line-height: 1.6;
}

.entry-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.entry-tag {
  color: #000080;
  font-size: 11px;
}

.entry-separator {
  color: #808080;
  margin-top: 8px;
  font-size: 11px;
}
</style>
