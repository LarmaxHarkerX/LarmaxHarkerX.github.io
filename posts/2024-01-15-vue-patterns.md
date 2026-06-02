---
title: Vue 3 Composition API Patterns
date: 2024-01-15
description: Common patterns and best practices for Vue 3 Composition API
category: Development
tags: [vue, composition-api, patterns, typescript]
---

# Vue 3 Composition API Patterns

The Composition API provides a more flexible way to organize Vue components.

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

## Pattern 2: Reactive State

Use `reactive` for complex objects:

```typescript
const state = reactive({
  user: null,
  posts: [],
  loading: false,
})
```

## Pattern 3: Watchers

Watch for changes and react:

```typescript
watch(
  () => state.user,
  (newUser, oldUser) => {
    if (newUser) {
      fetchPosts(newUser.id)
    }
  },
  { immediate: true }
)
```

## Pattern 4: Provide/Inject

Share data across components:

```typescript
// Parent
provide('theme', ref('dark'))

// Child
const theme = inject('theme')
```

## Best Practices

1. **Keep composables focused**: One concern per composable
2. **Use TypeScript**: Better type inference and IDE support
3. **Return refs**: Allow destructuring without losing reactivity
4. **Name conventions**: Use `use` prefix for composables

## Conclusion

The Composition API makes Vue 3 more powerful and flexible. Use these patterns to write clean, maintainable code.