---
title: Getting Started with Vue 3
date: 2024-01-01
description: A comprehensive guide to getting started with Vue 3 and the Composition API
category: Tutorial
tags: [vue, javascript, tutorial, beginner]
---

# Getting Started with Vue 3

Welcome to this comprehensive guide on getting started with **Vue 3**! This article will cover everything you need to know to begin your journey with modern Vue development.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Basic Concepts](#basic-concepts)
4. [Composition API](#composition-api)

## Introduction

Vue.js is a progressive JavaScript framework for building user interfaces. Unlike other monolithic frameworks, Vue is designed to be incrementally adoptable.

> "The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects." - Vue.js Official Documentation

### Why Choose Vue?

- **Approachable**: Already know HTML, CSS and JavaScript? Read the guide and start building!
- **Versatile**: A simple, minimal core with an ecosystem of libraries that scales between a framework and a full-featured solution.
- **Performant**: 20KB min+gzip, with virtual DOM and reactive rendering.

## Installation

There are several ways to install Vue 3:

### Using npm

```bash
npm install vue@next
```

### Using yarn

```bash
yarn add vue@next
```

### Using CDN

```html
<script src="https://unpkg.com/vue@next"></script>
```

### Using Vite (Recommended)

```bash
npm create vite@latest my-vue-app -- --template vue
```

## Basic Concepts

### Declarative Rendering

Vue uses a template syntax that allows you to declaratively bind the rendered DOM to the underlying Vue instance's data:

```vue
<script setup>
import { ref } from 'vue'

const message = ref('Hello Vue 3!')
</script>

<template>
  <h1>{{ message }}</h1>
</template>
```

### Directives

Vue provides special attributes called directives that are prefixed with `v-`:

| Directive | Purpose | Example |
|-----------|---------|---------|
| `v-bind` | Bind attributes | `<img v-bind:src="imageSrc">` |
| `v-on` | Listen to events | `<button v-on:click="doSomething">` |
| `v-model` | Two-way binding | `<input v-model="message">` |
| `v-if` | Conditional rendering | `<p v-if="show">Hello</p>` |
| `v-for` | List rendering | `<li v-for="item in items">` |

## Composition API

The Composition API is one of the most significant additions in Vue 3. It allows us to organize our code by logical concern.

### Reactive State

```vue
<script setup>
import { ref, reactive } from 'vue'

// ref for primitives
const count = ref(0)

// reactive for objects
const state = reactive({
  name: 'Vue',
  version: 3
})
</script>
```

### Computed Properties

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})
</script>
```

### Watchers

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')

watch(question, (newQuestion) => {
  if (newQuestion.includes('?')) {
    answer.value = 'Thinking...'
  }
})
</script>
```

## Key Differences from Vue 2

- **Composition API**: New way to organize component logic
- **Teleport**: Render DOM outside the component hierarchy
- **Fragments**: Multiple root nodes in templates
- **Suspense**: Async component loading
- **Better TypeScript support**: Full type inference

## Resources

- [Official Vue.js Documentation](https://vuejs.org/)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia State Management](https://pinia.vuejs.org/)

## Conclusion

Vue 3 brings many exciting improvements to an already excellent framework. The Composition API provides better code organization, improved TypeScript support, and more flexible logic reuse.

Happy coding! 🚀