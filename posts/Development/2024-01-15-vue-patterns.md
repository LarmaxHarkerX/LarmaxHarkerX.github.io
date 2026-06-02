---
title: Vue 3 Composition API Patterns
date: 2024-01-15
description: Common patterns and best practices for Vue 3 Composition API
category: Development
tags: [vue, composition-api, patterns, typescript]
---

# Vue 3 Composition API Patterns

The Composition API provides a more flexible way to organize Vue components. Let's explore some common patterns.

## Pattern 1: Composables

Extract reusable logic into composables:

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  return { count, doubled, increment, decrement }
}
```

Usage:

```vue
<script setup>
import { useCounter } from '@/composables/useCounter'

const { count, doubled, increment, decrement } = useCounter(10)
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>
```

## Pattern 2: Reactive State Management

Use `reactive` for complex objects:

```typescript
// stores/userStore.ts
import { reactive, computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
  isLoggedIn: boolean
}

const state = reactive({
  user: null as User | null,
  posts: [] as Post[],
  loading: false,
  error: null as string | null
})

export function useUserStore() {
  const isLoggedIn = computed(() => !!state.user)
  
  async function fetchUser(id: number) {
    state.loading = true
    state.error = null
    
    try {
      const response = await fetch(`/api/users/${id}`)
      state.user = await response.json()
    } catch (err) {
      state.error = err.message
    } finally {
      state.loading = false
    }
  }
  
  function logout() {
    state.user = null
  }
  
  return {
    ...toRefs(state),
    isLoggedIn,
    fetchUser,
    logout
  }
}
```

## Pattern 3: Watchers and Effects

Watch for changes and react:

```vue
<script setup>
import { ref, watch, watchEffect } from 'vue'

const searchQuery = ref('')
const searchResults = ref([])

// Watch specific ref
watch(searchQuery, async (newQuery, oldQuery) => {
  if (newQuery.length > 2) {
    searchResults.value = await fetchResults(newQuery)
  }
})

// Watch effect (runs immediately and tracks dependencies)
watchEffect(async () => {
  const data = await fetch(`/api/items?category=${category.value}`)
  items.value = await data.json()
})
</script>
```

## Pattern 4: Provide/Inject

Share data across components without prop drilling:

```vue
<!-- Parent.vue -->
<script setup>
import { provide, ref } from 'vue'

const theme = ref('dark')
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

provide('theme', theme)
provide('toggleTheme', toggleTheme)
</script>

<!-- Child.vue -->
<script setup>
import { inject } from 'vue'

const theme = inject('theme')
const toggleTheme = inject('toggleTheme')
</script>

<template>
  <div :class="theme">
    <button @click="toggleTheme">Toggle Theme</button>
  </div>
</template>
```

## Pattern 5: Renderless Components

Separate logic from presentation:

```vue
<!-- RenderlessCounter.vue -->
<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
const decrement = () => count.value++

defineExpose({ count, increment, decrement })
</script>

<template>
  <slot :count="count" :increment="increment" :decrement="decrement" />
</template>

<!-- Usage -->
<RenderlessCounter v-slot="{ count, increment, decrement }">
  <div class="my-custom-counter">
    <button @click="decrement">-</button>
    <span>{{ count }}</span>
    <button @click="increment">+</button>
  </div>
</RenderlessCounter>
```

## Pattern 6: Async Components with Suspense

```vue
<!-- AsyncComponent.vue -->
<script setup>
const data = await fetch('/api/data').then(r => r.json())
</script>

<template>
  <div>{{ data }}</div>
</template>

<!-- Parent.vue -->
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

## Best Practices

1. **Keep composables focused**: One concern per composable
2. **Use TypeScript**: Better type inference and IDE support
3. **Return refs**: Allow destructuring without losing reactivity
4. **Name conventions**: Use `use` prefix for composables
5. **Avoid side effects**: Keep composables pure when possible

## Common Pitfalls

### ❌ Forgetting `.value` in script

```typescript
const count = ref(0)
console.log(count) // Wrong: logs the ref object
console.log(count.value) // Correct: logs 0
```

### ❌ Destructuring reactive objects

```typescript
const state = reactive({ count: 0 })
const { count } = state // ❌ Loses reactivity
const count = toRef(state, 'count') // ✅ Keeps reactivity
```

### ❌ Not cleaning up effects

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'

let interval

onMounted(() => {
  interval = setInterval(() => {
    // do something
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval) // ✅ Clean up
})
</script>
```

## Conclusion

The Composition API makes Vue 3 more powerful and flexible. Use these patterns to write clean, maintainable code.

Happy coding! 🚀