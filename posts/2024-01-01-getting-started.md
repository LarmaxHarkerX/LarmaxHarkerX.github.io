---
title: Getting Started with Vue Terminal Blog
date: 2024-01-01
description: A guide to setting up your terminal-style blog with Vue 3
category: Tutorial
tags: [vue, blog, terminal, tutorial]
---

# Getting Started with Vue Terminal Blog

Welcome to your new terminal-style blog! This guide will help you get started.

## Features

- **Terminal UI**: Clean, developer-focused interface
- **Markdown Support**: Full markdown rendering with syntax highlighting
- **Fast**: Built with Vite for instant HMR
- **Static**: Pre-rendered for GitHub Pages deployment

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── assets/styles/     # CSS variables and themes
├── components/        # Vue components
│   ├── layout/        # Layout components
│   ├── terminal/      # Terminal UI components
│   └── ui/            # Reusable UI components
├── composables/       # Vue composables
├── pages/             # Page components
├── router/            # Vue Router config
└── stores/            # Pinia stores
```

## Customization

Edit `src/assets/styles/variables.css` to customize the terminal theme:

```css
:root {
  --terminal-bg: #0a0a0a;
  --terminal-fg: #c8d6c8;
  --terminal-accent: #39ff14;
}
```

Happy blogging! 🚀