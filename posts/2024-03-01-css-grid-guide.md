---
title: CSS Grid Complete Guide
date: 2024-03-01
description: Master CSS Grid with practical examples and patterns
category: CSS
tags: [css, grid, layout, frontend]
---

# CSS Grid Complete Guide

CSS Grid is a powerful layout system that makes complex layouts simple.

## Basic Grid

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
```

### Result

```
+--------+--------+--------+
| Item 1 | Item 2 | Item 3 |
+--------+--------+--------+
| Item 4 | Item 5 | Item 6 |
+--------+--------+--------+
```

## Grid Template Areas

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

### Visual Representation

```
+------------------------------------------+
|                 HEADER                    |
+----------+------------------+------------+
|          |                  |            |
| SIDEBAR  |       MAIN       |   ASIDE   |
|          |                  |            |
+----------+------------------+------------+
|                 FOOTER                    |
+------------------------------------------+
```

## Responsive Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

This creates a responsive grid that:
- Has columns at least 250px wide
- Automatically fits as many columns as possible
- Fills available space equally

## Grid Alignment

### Align Items (Vertical)

```css
.container {
  display: grid;
  align-items: start;    /* top */
  align-items: center;   /* center */
  align-items: end;      /* bottom */
  align-items: stretch;  /* fill container */
}
```

### Justify Items (Horizontal)

```css
.container {
  display: grid;
  justify-items: start;   /* left */
  justify-items: center;  /* center */
  justify-items: end;     /* right */
  justify-items: stretch; /* fill container */
}
```

### Align Self (Individual Item)

```css
.item {
  align-self: start;
  align-self: center;
  align-self: end;
}
```

## Grid Gap

```css
.container {
  display: grid;
  gap: 20px;           /* row and column gap */
  row-gap: 20px;       /* only row gap */
  column-gap: 20px;    /* only column gap */
}
```

## Implicit Grid

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto);
  grid-auto-flow: row;        /* default: fill row by row */
  grid-auto-flow: column;     /* fill column by column */
  grid-auto-flow: dense;      /* fill gaps */
}
```

## Named Lines

```css
.container {
  display: grid;
  grid-template-columns:
    [full-start] 1fr
    [content-start] minmax(0, 1200px) [content-end]
    1fr [full-end];
}

.content {
  grid-column: content-start / content-end;
}
```

## Subgrid

```css
.parent {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
}

.child {
  display: grid;
  grid-column: 2 / 4;
  grid-row: 1 / 3;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}
```

## Common Patterns

### Holy Grail Layout

```css
.holy-grail {
  display: grid;
  grid-template:
    "header header header" auto
    "nav    main   aside" 1fr
    "footer footer footer" auto
    / 200px 1fr 200px;
  min-height: 100vh;
}
```

### Card Grid

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.card {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
```

### Dashboard Layout

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto repeat(3, 1fr);
  gap: 16px;
}

.widget-small {
  grid-column: span 1;
  grid-row: span 1;
}

.widget-medium {
  grid-column: span 2;
  grid-row: span 1;
}

.widget-large {
  grid-column: span 2;
  grid-row: span 2;
}
```

## Grid vs Flexbox

| Feature | Grid | Flexbox |
|---------|------|---------|
| Dimension | 2D (rows & columns) | 1D (row or column) |
| Layout | Content in cells | Content flows |
| Alignment | Both axes | Main axis |
| Use case | Page layout | Component layout |

### When to Use Grid

- Complex page layouts
- Two-dimensional alignment
- Overlapping elements
- Named areas

### When to Use Flexbox

- Navigation bars
- Card layouts
- Centering content
- Simple one-dimensional layouts

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | 57+ |
| Firefox | 52+ |
| Safari | 10.1+ |
| Edge | 16+ |
| IE 11 | Partial (old syntax) |

## Tips and Tricks

### 1. Use fr Unit

```css
/* Instead of percentages */
grid-template-columns: 50% 25% 25%;

/* Use fr */
grid-template-columns: 2fr 1fr 1fr;
```

### 2. Minmax for Responsive

```css
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

### 3. Grid for Overlapping

```css
.overlap {
  display: grid;
}

.overlap > * {
  grid-area: 1 / 1;
}
```

### 4. Gap for Spacing

```css
/* Use gap instead of margins */
.container {
  display: grid;
  gap: 20px;
}
```

## Conclusion

CSS Grid is a powerful tool for modern web layouts. It simplifies complex layouts and provides better control over both dimensions.

Happy gridding! 🎨