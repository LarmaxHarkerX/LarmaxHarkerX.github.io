import { onMounted, onUnmounted, ref } from 'vue'
import { resolveProgram } from '../modules/windows/registry'
import type { Win3xIconKey } from '../modules/windows/icons'
import type { WindowComponentKey, WindowData, WindowState } from '../modules/windows/types'

const INITIAL_Z_INDEX = 10

function getTopVisibleWindowId(windows: WindowState[]) {
  return windows
    .filter((windowState) => windowState.isOpen && !windowState.isMinimized)
    .sort((left, right) => right.zIndex - left.zIndex)[0]?.id ?? null
}

function createWindowState(
  id: string,
  title: string,
  icon: Win3xIconKey,
  component: WindowComponentKey,
  data: WindowData,
  order: number,
  zIndex: number,
): WindowState {
  const offsetX = (order % 5) * 30
  const offsetY = (order % 5) * 30

  return {
    id,
    title,
    icon,
    x: 50 + offsetX,
    y: 50 + offsetY,
    width: 700,
    height: 500,
    minWidth: 300,
    minHeight: 200,
    zIndex,
    isOpen: true,
    isMaximized: false,
    isMinimized: false,
    component,
    data,
  }
}

export function useWindowSession() {
  const windows = ref<WindowState[]>([])
  const activeWindowId = ref<string | null>(null)
  let nextZIndex = INITIAL_Z_INDEX

  const pushHistoryState = (windowId: string) => {
    history.pushState({ windowId }, '', `#${windowId}`)
  }

  const replaceHistoryState = (windowId: string | null) => {
    const nextUrl = windowId
      ? `#${windowId}`
      : `${window.location.pathname}${window.location.search}`

    history.replaceState(windowId ? { windowId } : null, '', nextUrl)
  }

  const syncActiveWindow = () => {
    activeWindowId.value = getTopVisibleWindowId(windows.value)
    replaceHistoryState(activeWindowId.value)
  }

  const focusWindow = (id: string) => {
    const windowState = windows.value.find((entry) => entry.id === id)

    if (!windowState || !windowState.isOpen) {
      return
    }

    windowState.isMinimized = false
    windowState.zIndex = nextZIndex++
    activeWindowId.value = id
  }

  const openWindow = (
    id: string,
    title: string,
    icon: Win3xIconKey,
    component: WindowComponentKey,
    data?: WindowData,
  ) => {
    const existingWindow = windows.value.find((entry) => entry.id === id)

    if (existingWindow) {
      existingWindow.isOpen = true
      existingWindow.isMinimized = false
      existingWindow.zIndex = nextZIndex++

      if (data !== undefined) {
        existingWindow.data = data
      }

      activeWindowId.value = id
      pushHistoryState(id)
      return existingWindow
    }

    const windowState = createWindowState(
      id,
      title,
      icon,
      component,
      data,
      windows.value.length,
      nextZIndex++,
    )

    windows.value.push(windowState)
    activeWindowId.value = id
    pushHistoryState(id)

    return windowState
  }

  const openProgram = (action: string) => {
    const program = resolveProgram(action)

    if (!program) {
      return null
    }

    return openWindow(program.action, program.title, program.icon, program.component)
  }

  const openPost = (path: string, title = 'Blog Post', parentFolder = '') => {
    return openWindow(`post-${path}`, title, 'document', 'BlogPost', {
      path,
      title,
      parentFolder,
    })
  }

  const closeWindow = (id: string) => {
    const windowState = windows.value.find((entry) => entry.id === id)

    if (!windowState) {
      return
    }

    windowState.isOpen = false
    windowState.isMinimized = false

    if (activeWindowId.value === id) {
      syncActiveWindow()
      return
    }

    replaceHistoryState(activeWindowId.value)
  }

  const moveWindow = (id: string, x: number, y: number) => {
    const windowState = windows.value.find((entry) => entry.id === id)

    if (!windowState) {
      return
    }

    windowState.x = x
    windowState.y = y
  }

  const resizeWindow = (id: string, width: number, height: number) => {
    const windowState = windows.value.find((entry) => entry.id === id)

    if (!windowState) {
      return
    }

    windowState.width = width
    windowState.height = height
  }

  const maximizeWindow = (id: string) => {
    const windowState = windows.value.find((entry) => entry.id === id)

    if (!windowState) {
      return
    }

    windowState.isMaximized = !windowState.isMaximized
  }

  const minimizeWindow = (id: string) => {
    const windowState = windows.value.find((entry) => entry.id === id)

    if (!windowState) {
      return
    }

    windowState.isMinimized = true

    if (activeWindowId.value === id) {
      syncActiveWindow()
      return
    }

    replaceHistoryState(activeWindowId.value)
  }

  const resetSession = () => {
    windows.value = []
    activeWindowId.value = null
    nextZIndex = INITIAL_Z_INDEX
    replaceHistoryState(null)
  }

  const handlePopState = (event: PopStateEvent) => {
    const windowId = event.state?.windowId as string | undefined

    if (!windowId) {
      activeWindowId.value = null
      return
    }

    const windowState = windows.value.find((entry) => entry.id === windowId)

    if (windowState) {
      focusWindow(windowState.id)
    }
  }

  onMounted(() => {
    window.addEventListener('popstate', handlePopState)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', handlePopState)
  })

  return {
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
  }
}
