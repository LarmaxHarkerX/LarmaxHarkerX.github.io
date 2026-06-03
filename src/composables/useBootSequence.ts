import { onMounted, onUnmounted, ref } from 'vue'

export type BootPhase = 'bsod' | 'bios' | 'loading' | 'desktop'

export interface BootTask {
  message: string
  run: () => Promise<unknown> | unknown
}

const bsodLines = [
  'A problem has been detected and Windows has been shut down to prevent damage',
  'to your desktop shell.',
  '',
  'An exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.',
  'This was called from 0028:C180A2F4 in VXD IOS(04) + 000012F4.',
  'It may be possible to continue normally.',
  '',
  '* Press any key to return to the system shell.',
  '* Press CTRL+ALT+DEL again to restart your computer. You will',
  '  lose any unsaved information in all applications.',
]

const bsodPrompt = 'Press any key to continue'

const biosMessages = [
  'PhoenixBIOS A486 Version 1.10',
  'Copyright 1985-1992 Phoenix Technologies Ltd.',
  '',
  'LARMAX SYSTEMS 486DX2/66',
  'CPU at 66MHz',
  '',
  'Main Processor  : Intel 80486DX2',
  'Memory Test     : 16384K OK',
  'Primary Display : VGA/EGA',
  'Keyboard        : Detected',
  '',
  'Fixed Disk 0    : WDC AC2850F',
  'Fixed Disk 1    : None',
  'Boot Sequence   : C:, A:',
  '',
  'C:\\>WIN',
]

const defaultLoadingMessages = [
  'Loading HIMEM.SYS',
  'Loading KRNL386.EXE',
  'Loading GDI.EXE',
  'Loading USER.EXE',
  'Initializing Program Manager',
  'Restoring desktop icons',
  'Opening shell workspace',
  'Ready to launch applications',
]

export function useBootSequence(bootTasks: BootTask[] = []) {
  const bootPhase = ref<BootPhase>('bios')
  const biosLines = ref<string[]>([])
  const crashLines = ref<string[]>(bsodLines)
  const crashPrompt = ref(bsodPrompt)
  const currentTime = ref('')
  const loadingStatus = ref('Preparing system memory')
  const loadingProgress = ref(0)
  const loadingLog = ref<string[]>([])

  let clockInterval: number | null = null
  let biosInterval: number | null = null
  let bootTimeouts: number[] = []
  let bootRunToken = 0

  const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const stopClock = () => {
    if (clockInterval !== null) {
      window.clearInterval(clockInterval)
      clockInterval = null
    }
  }

  const clearBootTimers = () => {
    if (biosInterval !== null) {
      window.clearInterval(biosInterval)
      biosInterval = null
    }

    for (const timeoutId of bootTimeouts) {
      window.clearTimeout(timeoutId)
    }

    bootTimeouts = []
  }

  const schedule = (callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      bootTimeouts = bootTimeouts.filter((id) => id !== timeoutId)
      callback()
    }, delay)

    bootTimeouts.push(timeoutId)
  }

  const startClock = () => {
    stopClock()
    updateTime()
    clockInterval = window.setInterval(updateTime, 1000)
  }

  const wait = (delay: number) => new Promise<void>((resolve) => {
    schedule(resolve, delay)
  })

  const getLoadingTasks = () => {
    if (bootTasks.length > 0) {
      return bootTasks
    }

    return defaultLoadingMessages.map((message) => ({
      message,
      run: () => undefined,
    }))
  }

  const runLoadingPhase = async (token: number) => {
    const tasks = getLoadingTasks()
    bootPhase.value = 'loading'
    loadingLog.value = []

    for (const [index, task] of tasks.entries()) {
      if (token !== bootRunToken) {
        return
      }

      loadingStatus.value = task.message

      await Promise.all([
        Promise.resolve(task.run()),
        wait(index === 0 ? 360 : 260),
      ])

      if (token !== bootRunToken) {
        return
      }

      loadingProgress.value = Math.round(((index + 1) / tasks.length) * 100)
      loadingLog.value = [...loadingLog.value, task.message].slice(-4)
    }

    await wait(600)

    if (token !== bootRunToken) {
      return
    }

    bootPhase.value = 'desktop'
    startClock()
  }

  const startBsodSequence = () => {
    bootRunToken += 1
    const token = bootRunToken
    stopClock()
    clearBootTimers()
    bootPhase.value = 'bsod'
    crashLines.value = bsodLines
    crashPrompt.value = bsodPrompt

    schedule(() => {
      if (token !== bootRunToken) {
        return
      }

      startBootSequence()
    }, 1800)
  }

  const startBootSequence = () => {
    bootRunToken += 1
    const token = bootRunToken
    stopClock()
    clearBootTimers()
    bootPhase.value = 'bios'
    biosLines.value = []
    loadingStatus.value = 'Preparing system memory'
    loadingProgress.value = 0
    loadingLog.value = []

    let lineIndex = 0

    biosInterval = window.setInterval(() => {
      if (lineIndex < biosMessages.length) {
        biosLines.value.push(biosMessages[lineIndex])
        lineIndex += 1
        return
      }

      if (biosInterval !== null) {
        window.clearInterval(biosInterval)
        biosInterval = null
      }

      schedule(() => {
        void runLoadingPhase(token)
      }, 450)
    }, 90)
  }

  onMounted(startBootSequence)

  onUnmounted(() => {
    stopClock()
    clearBootTimers()
  })

  return {
    bootPhase,
    biosLines,
    crashLines,
    crashPrompt,
    currentTime,
    loadingStatus,
    loadingProgress,
    loadingLog,
    startBsodSequence,
    startBootSequence,
  }
}
