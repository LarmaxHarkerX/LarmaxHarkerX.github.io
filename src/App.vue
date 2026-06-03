<script setup lang="ts">
import { ref } from 'vue'
import BootBiosScene from './components/boot/BootBiosScene.vue'
import BootBsodScene from './components/boot/BootBsodScene.vue'
import BootSplashScene from './components/boot/BootSplashScene.vue'
import Desktop from './components/layout/Desktop.vue'
import WindowManager from './components/layout/WindowManager.vue'
import ProgramManagerWindow from './components/windows/ProgramManagerWindow.vue'
import FileManagerWindow from './components/windows/FileManagerWindow.vue'
import NotepadWindow from './components/windows/NotepadWindow.vue'
import CardfileWindow from './components/windows/CardfileWindow.vue'
import AboutWindow from './components/windows/AboutWindow.vue'
import BlogPostWindow from './components/windows/BlogPostWindow.vue'
import { useFriends } from './composables/useFriends'
import { useBootSequence } from './composables/useBootSequence'
import { useMoments } from './composables/useMoments'
import { usePosts } from './composables/usePosts'
import { useWindowSession } from './composables/useWindowSession'
import { shutdownAction } from './modules/windows/registry'

const { ensurePostsLoaded } = usePosts()
const { ensureFriendsLoaded } = useFriends()
const { ensureMomentsLoaded } = useMoments()
const {
  bootPhase,
  biosLines,
  crashLines,
  crashPrompt,
  currentTime,
  loadingStatus,
  loadingProgress,
  loadingLog,
  startBsodSequence,
} = useBootSequence([
  { message: 'Indexing blog catalog', run: ensurePostsLoaded },
  { message: 'Loading notebook entries', run: ensureMomentsLoaded },
  { message: 'Loading cardfile records', run: ensureFriendsLoaded },
  { message: 'Restoring desktop shell', run: () => undefined },
])
const {
  windows,
  activeWindowId,
  openProgram,
  openPost,
  closeWindow,
  focusWindow,
  moveWindow,
  resizeWindow,
  maximizeWindow,
  minimizeWindow,
  resetSession,
} = useWindowSession()

const showStartMenu = ref(false)
const fileManagerFolder = ref('')

const closeStartMenu = () => {
  showStartMenu.value = false
}

const toggleStartMenu = () => {
  showStartMenu.value = !showStartMenu.value
}

const handleStartAction = (action: string) => {
  closeStartMenu()

  if (action === shutdownAction) {
    resetSession()
    startBsodSequence()
    return
  }

  openProgram(action)
}

const handleIconDblClick = (action: string) => {
  handleStartAction(action)
}

const handleOpenPost = (path: string, parentFolder: string, title: string) => {
  fileManagerFolder.value = parentFolder
  openPost(path, title, parentFolder)
}

const handleBackToFileManager = (windowId: string, folder = '') => {
  closeWindow(windowId)
  fileManagerFolder.value = folder
  openProgram('/blog')
}

const handleFileManagerFolderChange = (folder: string) => {
  fileManagerFolder.value = folder
}

const handleTaskbarClick = (id: string) => {
  closeStartMenu()
  focusWindow(id)
}

const handleWindowFocus = (id: string) => {
  closeStartMenu()
  focusWindow(id)
}
</script>

<template>
  <div class="app">
    <Transition name="fade" mode="out-in">
      <BootBsodScene
        v-if="bootPhase === 'bsod'"
        key="bsod"
        :lines="crashLines"
        :prompt="crashPrompt"
      />

      <BootBiosScene v-else-if="bootPhase === 'bios'" key="bios" :lines="biosLines" />

      <BootSplashScene
        v-else-if="bootPhase === 'loading'"
        key="loading"
        :status="loadingStatus"
        :progress="loadingProgress"
        :log="loadingLog"
      />

      <div v-else class="desktop-container" key="desktop">
        <Desktop 
          :current-time="currentTime"
          :show-start-menu="showStartMenu"
          :windows="windows.filter(w => w.isOpen)"
          :active-window-id="activeWindowId"
          @toggle-start="toggleStartMenu"
          @close-start="closeStartMenu"
          @start-action="handleStartAction"
          @icon-dblclick="handleIconDblClick"
          @taskbar-click="handleTaskbarClick"
        />
        
        <WindowManager
          :windows="windows"
          :active-window-id="activeWindowId"
          @close="closeWindow"
          @focus="handleWindowFocus"
          @move="moveWindow"
          @resize="resizeWindow"
          @maximize="maximizeWindow"
          @minimize="minimizeWindow"
        >
          <template v-for="win in windows" :key="win.id" #[win.id]>
            <ProgramManagerWindow 
              v-if="win.component === 'ProgramManager'"
              @open="handleStartAction"
            />
            <FileManagerWindow 
              v-else-if="win.component === 'FileManager'"
              :folder="fileManagerFolder"
              @open-post="handleOpenPost"
              @folder-change="handleFileManagerFolderChange"
            />
            <NotepadWindow 
              v-else-if="win.component === 'Notepad'"
            />
            <CardfileWindow 
              v-else-if="win.component === 'Cardfile'"
            />
            <AboutWindow 
              v-else-if="win.component === 'About'"
              @close="closeWindow(win.id)"
            />
            <BlogPostWindow 
              v-else-if="win.component === 'BlogPost' && win.data?.path"
              :path="win.data.path"
              @back="handleBackToFileManager(win.id, win.data.parentFolder)"
            />
          </template>
        </WindowManager>
      </div>
    </Transition>
  </div>
</template>

<style>
@import './assets/styles/main.css';
</style>

<style scoped>
.app {
  min-height: 100vh;
  background: #000;
}

.desktop-container {
  min-height: 100vh;
}

.fade-enter-active { transition: opacity 0.3s; }
.fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
