import type { Win3xIconKey } from './icons'

export type WindowComponentKey =
  | 'ProgramManager'
  | 'FileManager'
  | 'Notepad'
  | 'Cardfile'
  | 'About'
  | 'BlogPost'

export interface BlogPostWindowData {
  path: string
  title: string
  parentFolder: string
}

export type WindowData = BlogPostWindowData | undefined

export interface WindowState {
  id: string
  title: string
  icon: Win3xIconKey
  x: number
  y: number
  width: number
  height: number
  minWidth: number
  minHeight: number
  zIndex: number
  isOpen: boolean
  isMaximized: boolean
  isMinimized: boolean
  component: WindowComponentKey
  data?: WindowData
}

export interface DesktopProgramDefinition {
  id: string
  action: string
  title: string
  icon: Win3xIconKey
  component: Exclude<WindowComponentKey, 'BlogPost'>
  desktopLabel: string
  menuLabel: string
}
