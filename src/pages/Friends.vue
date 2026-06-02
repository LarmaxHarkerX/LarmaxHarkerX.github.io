<script setup lang="ts">
import { ref, computed } from 'vue'
import TerminalWindow from '../components/layout/TerminalWindow.vue'
import friendsData from '../data/friends.json'

interface Friend {
  name: string
  avatar: string
  description: string
  url: string
  color: string
}

const friends = ref<Friend[]>(friendsData)
const currentIndex = ref(0)

const currentFriend = computed(() => friends.value[currentIndex.value])

const nextFriend = () => {
  currentIndex.value = (currentIndex.value + 1) % friends.value.length
}

const prevFriend = () => {
  currentIndex.value = (currentIndex.value - 1 + friends.value.length) % friends.value.length
}

const visitFriend = () => {
  window.open(currentFriend.value.url, '_blank')
}
</script>

<template>
  <div class="friends-page">
    <TerminalWindow 
      title="Cardfile - Friends" 
      icon="📇"
      :showMenu="true"
      :menuItems="['File', 'Card', 'Search', 'Help']"
      :showStatus="true"
      :statusText="`Card ${currentIndex + 1} of ${friends.length}`"
      width="100%"
    >
      <!-- Toolbar -->
      <div class="win31-toolbar">
        <button class="win31-toolbar-button" title="Add Card">➕</button>
        <button class="win31-toolbar-button" title="Delete Card">➖</button>
        <div class="win31-toolbar-separator"></div>
        <button class="win31-toolbar-button" title="Previous" @click="prevFriend">⬆️</button>
        <button class="win31-toolbar-button" title="Next" @click="nextFriend">⬇️</button>
        <div class="win31-toolbar-separator"></div>
        <button class="win31-toolbar-button" title="Visit" @click="visitFriend">🔗</button>
      </div>
      
      <!-- Card Content -->
      <div class="card-content">
        <div class="card-index">
          <div class="index-label">Index</div>
          <div class="index-list">
            <div 
              v-for="(friend, index) in friends" 
              :key="friend.name"
              class="index-item"
              :class="{ 'index-item--active': index === currentIndex }"
              @click="currentIndex = index"
            >
              {{ friend.name }}
            </div>
          </div>
        </div>
        
        <div class="card-detail">
          <div class="card-header">
            <div class="card-avatar">
              <img :src="currentFriend.avatar" :alt="currentFriend.name" />
            </div>
            <div class="card-info">
              <div class="card-name">{{ currentFriend.name }}</div>
              <div class="card-description">{{ currentFriend.description }}</div>
            </div>
          </div>
          
          <div class="card-fields">
            <div class="field-row">
              <span class="field-label">Name:</span>
              <input 
                type="text" 
                class="win31-input field-input" 
                :value="currentFriend.name" 
                readonly
              />
            </div>
            <div class="field-row">
              <span class="field-label">URL:</span>
              <input 
                type="text" 
                class="win31-input field-input" 
                :value="currentFriend.url" 
                readonly
              />
            </div>
            <div class="field-row">
              <span class="field-label">Type:</span>
              <input 
                type="text" 
                class="win31-input field-input" 
                value="Website" 
                readonly
              />
            </div>
          </div>
          
          <div class="card-actions">
            <button class="win31-button" @click="prevFriend">
              ← Previous
            </button>
            <button class="win31-button win31-button--default" @click="visitFriend">
              Visit
            </button>
            <button class="win31-button" @click="nextFriend">
              Next →
            </button>
          </div>
        </div>
      </div>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.friends-page {
  width: 100%;
}

.card-content {
  display: flex;
  flex: 1;
  background: var(--win31-white);
  box-shadow: var(--bevel-inset);
  margin: 2px;
  overflow: hidden;
}

.card-index {
  width: 150px;
  border-right: 2px solid;
  border-color: var(--win31-dark-gray) var(--win31-white) 
                var(--win31-white) var(--win31-dark-gray);
  display: flex;
  flex-direction: column;
}

.index-label {
  background: var(--win31-gray);
  padding: 4px 8px;
  font-family: var(--font-system);
  font-size: var(--text-sm);
  font-weight: bold;
  border-bottom: 1px solid var(--win31-dark-gray);
}

.index-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px;
}

.index-item {
  padding: 4px 8px;
  font-family: var(--font-system);
  font-size: var(--text-sm);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.index-item:hover {
  background: var(--win31-selection);
  color: var(--win31-selection-text);
}

.index-item--active {
  background: var(--win31-selection);
  color: var(--win31-selection-text);
}

.card-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.card-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--win31-dark-gray);
}

.card-avatar {
  width: 64px;
  height: 64px;
  border: 2px solid;
  border-color: var(--win31-white) var(--win31-black) 
                var(--win31-black) var(--win31-white);
  box-shadow: var(--bevel-inset);
  overflow: hidden;
  flex-shrink: 0;
}

.card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  flex: 1;
}

.card-name {
  font-family: var(--font-system);
  font-weight: bold;
  font-size: var(--text-lg);
  margin-bottom: 4px;
}

.card-description {
  font-family: var(--font-system);
  font-size: var(--text-sm);
  color: var(--win31-dark-gray);
}

.card-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-label {
  font-family: var(--font-system);
  font-size: var(--text-sm);
  font-weight: bold;
  width: 60px;
  flex-shrink: 0;
}

.field-input {
  flex: 1;
}

.card-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--win31-dark-gray);
}

@media (max-width: 768px) {
  .card-content {
    flex-direction: column;
  }
  
  .card-index {
    width: 100%;
    border-right: none;
    border-bottom: 2px solid;
    border-color: var(--win31-dark-gray) var(--win31-white) 
                  var(--win31-white) var(--win31-dark-gray);
    max-height: 120px;
  }
  
  .index-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .index-item {
    padding: 4px 8px;
    background: var(--win31-gray);
    border: 1px solid var(--win31-dark-gray);
  }
  
  .card-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .field-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .field-label {
    width: auto;
  }
}
</style>