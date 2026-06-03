import { ref } from 'vue'
import { loadMomentIndex } from '../modules/content/moments'
import type { Moment } from '../modules/content/types'

const moments = ref<Moment[]>([])
const isLoaded = ref(false)

export function useMoments() {
  const ensureMomentsLoaded = async () => {
    if (isLoaded.value) {
      return
    }

    moments.value = loadMomentIndex()
    isLoaded.value = true
  }

  return {
    moments,
    isLoaded,
    ensureMomentsLoaded,
  }
}
