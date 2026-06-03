import { ref } from 'vue'
import { loadFriendIndex } from '../modules/content/friends'
import type { Friend } from '../modules/content/types'

const friends = ref<Friend[]>([])
const isLoaded = ref(false)

export function useFriends() {
  const ensureFriendsLoaded = async () => {
    if (isLoaded.value) {
      return
    }

    friends.value = loadFriendIndex()
    isLoaded.value = true
  }

  return {
    friends,
    isLoaded,
    ensureFriendsLoaded,
  }
}
