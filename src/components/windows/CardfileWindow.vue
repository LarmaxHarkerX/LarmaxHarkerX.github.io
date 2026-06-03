<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Win3xIcon from '../shared/Win3xIcon.vue'
import { useFriends } from '../../composables/useFriends'

const { friends, ensureFriendsLoaded } = useFriends()
const currentIndex = ref(0)

onMounted(() => {
  void ensureFriendsLoaded()
})

const currentFriend = computed(() => friends.value[currentIndex.value])

const nextFriend = () => {
  if (friends.value.length === 0) {
    return
  }

  currentIndex.value = (currentIndex.value + 1) % friends.value.length
}

const prevFriend = () => {
  if (friends.value.length === 0) {
    return
  }

  currentIndex.value = (currentIndex.value - 1 + friends.value.length) % friends.value.length
}

const visitBlog = () => {
  if (currentFriend.value?.blog) {
    window.open(currentFriend.value.blog, '_blank', 'noopener,noreferrer')
  }
}

const visitGithub = () => {
  if (currentFriend.value?.github) {
    window.open(currentFriend.value.github, '_blank', 'noopener,noreferrer')
  }
}
</script>

<template>
  <div class="cardfile">
    <div class="win31-toolbar">
      <button type="button" class="win31-toolbar-button" title="Previous card" @click="prevFriend">
        <Win3xIcon name="up" size="small" label="Previous card" />
      </button>
      <button type="button" class="win31-toolbar-button" title="Next card" @click="nextFriend">
        <Win3xIcon name="down" size="small" label="Next card" />
      </button>
      <div class="win31-toolbar-separator"></div>
      <button type="button" class="win31-toolbar-button" title="Blog" @click="visitBlog">
        <Win3xIcon name="link" size="small" label="Blog" />
      </button>
      <button type="button" class="win31-toolbar-button" title="GitHub" @click="visitGithub">
        <Win3xIcon name="archive" size="small" label="GitHub" />
      </button>
    </div>
    
    <div class="cf-content win31-pane">
      <div class="cf-index">
        <div class="cf-index-header">Index</div>
        <div class="cf-index-list">
          <div 
            v-for="(friend, index) in friends" 
            :key="friend.slug"
            class="cf-index-item"
            :class="{ active: index === currentIndex }"
            @click="currentIndex = index"
          >
            {{ friend.name }}
          </div>
        </div>
      </div>
      
      <div v-if="currentFriend" class="cf-detail">
        <div class="cf-avatar">
          <img :src="currentFriend.avatar" :alt="currentFriend.name" />
        </div>
        <div class="cf-name">{{ currentFriend.name }}</div>
        <div class="cf-desc">{{ currentFriend.description }}</div>
        <div class="cf-fields">
          <div class="cf-field">
            <span class="cf-label">Blog:</span>
            <input class="cf-input win31-input" :value="currentFriend.blog" readonly />
          </div>
          <div class="cf-field">
            <span class="cf-label">GitHub:</span>
            <input class="cf-input win31-input" :value="currentFriend.github" readonly />
          </div>
        </div>
        <div class="cf-actions">
          <button class="cf-action-btn win31-button" @click="prevFriend">← Previous</button>
          <button class="cf-action-btn win31-button primary" @click="visitBlog">Visit Blog</button>
          <button class="cf-action-btn win31-button" @click="nextFriend">Next →</button>
        </div>
      </div>
    </div>
    
    <div class="cf-status win31-statusbar">
      <span>Card {{ currentIndex + 1 }} of {{ friends.length }}</span>
    </div>
  </div>
</template>

<style scoped>
.cardfile {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cf-content {
  flex: 1;
  display: flex;
}

.cf-index {
  width: 120px;
  border-right: 2px solid;
  border-color: #808080 #fff #fff #808080;
  display: flex;
  flex-direction: column;
}

.cf-index-header {
  background: #c0c0c0;
  padding: 4px 8px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  font-weight: bold;
  border-bottom: 1px solid #808080;
}

.cf-index-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px;
}

.cf-index-item {
  padding: 4px 8px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  cursor: pointer;
}

.cf-index-item:hover,
.cf-index-item.active {
  background: #000080;
  color: #fff;
}

.cf-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 8px;
}

.cf-avatar {
  width: 64px;
  height: 64px;
  border: 2px solid;
  border-color: #fff #000 #000 #fff;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;
  overflow: hidden;
}

.cf-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cf-name {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-weight: bold;
  font-size: 14px;
}

.cf-desc {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: #808080;
  text-align: center;
}

.cf-fields {
  width: 100%;
  max-width: 300px;
}

.cf-field {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.cf-label {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  font-weight: bold;
  width: 50px;
}

.cf-input {
  flex: 1;
  cursor: text;
}

.cf-input:focus {
  background: #fff;
}

.cf-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.cf-action-btn {
  padding: 4px 12px;
  font-size: 11px;
}

.cf-action-btn:active {
  padding: 5px 11px 3px 13px;
}

.cf-action-btn.primary {
  font-weight: bold;
}

@media (max-width: 500px) {
  .cf-content {
    flex-direction: column;
  }
  
  .cf-index {
    width: 100%;
    border-right: none;
    border-bottom: 2px solid;
    border-color: #808080 #fff #fff #808080;
    max-height: 100px;
  }
  
  .cf-index-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .cf-index-item {
    padding: 4px 8px;
    background: #c0c0c0;
    border: 1px solid #808080;
  }
  
  .cf-index-item.active {
    background: #000080;
    color: #fff;
  }
}
</style>
