import type { DesktopProgramDefinition } from './types'

export const shutdownAction = 'shutdown' as const

const registry: DesktopProgramDefinition[] = [
  {
    id: 'program-manager',
    action: '/',
    title: 'Program Manager',
    icon: 'programManager',
    component: 'ProgramManager',
    desktopLabel: 'Program\nManager',
    menuLabel: 'Program Manager',
  },
  {
    id: 'file-manager',
    action: '/blog',
    title: 'File Manager',
    icon: 'fileManager',
    component: 'FileManager',
    desktopLabel: 'File\nManager',
    menuLabel: 'File Manager',
  },
  {
    id: 'moments',
    action: '/moments',
    title: 'Notepad',
    icon: 'notepad',
    component: 'Notepad',
    desktopLabel: 'Notepad',
    menuLabel: 'Notepad',
  },
  {
    id: 'friends',
    action: '/friends',
    title: 'Cardfile',
    icon: 'cardfile',
    component: 'Cardfile',
    desktopLabel: 'Cardfile',
    menuLabel: 'Cardfile',
  },
  {
    id: 'about',
    action: '/about',
    title: 'About',
    icon: 'computer',
    component: 'About',
    desktopLabel: 'About',
    menuLabel: 'About',
  },
]

const actionMap = new Map<string, DesktopProgramDefinition>()

for (const program of registry) {
  actionMap.set(program.action, program)
}

export const desktopPrograms = registry
export const startMenuPrograms: DesktopProgramDefinition[] = [...registry, {
  id: 'shutdown',
  action: shutdownAction,
  title: 'Shut Down...',
  icon: 'shutdown',
  component: 'About',
  desktopLabel: 'Shut Down...',
  menuLabel: 'Shut Down...',
}]

export function resolveProgram(action: string) {
  return actionMap.get(action)
}
