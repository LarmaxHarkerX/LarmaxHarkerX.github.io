---
title: Markdown Complete Guide
date: 2024-02-01
description: A comprehensive guide to all Markdown syntax elements
category: Tutorial
tags: [markdown, syntax, guide, documentation]
---

# Markdown Complete Guide

This article demonstrates all Markdown syntax elements for testing the blog's rendering capabilities.

## Text Formatting

### Basic Formatting

- **Bold text** using `**bold**`
- *Italic text* using `*italic*`
- ***Bold and italic*** using `***bold italic***`
- ~~Strikethrough~~ using `~~strikethrough~~`
- `Inline code` using backticks

### Links

- [Vue.js Official](https://vuejs.org/)
- [GitHub](https://github.com)
- [MDN Web Docs](https://developer.mozilla.org/)

### Images

![Vue Logo](https://vuejs.org/images/logo.png)

## Lists

### Unordered List

- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
    - Deep nested item 2.2.1
- Item 3

### Ordered List

1. First item
2. Second item
3. Third item
   1. Nested item 3.1
   2. Nested item 3.2

### Task List

- [x] Completed task
- [x] Another completed task
- [ ] Incomplete task
- [ ] Another incomplete task

## Code Blocks

### JavaScript

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

### TypeScript

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

### Python

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))
```

### HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello World</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a paragraph.</p>
</body>
</html>
```

### CSS

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}
```

### Bash

```bash
# Clone repository
git clone https://github.com/example/repo.git

# Navigate to directory
cd repo

# Install dependencies
npm install

# Start development server
npm run dev
```

## Tables

### Basic Table

| Name | Age | City |
|------|-----|------|
| John | 28 | New York |
| Jane | 32 | London |
| Bob | 25 | Paris |

### Table with Alignment

| Left-aligned | Center-aligned | Right-aligned |
|:-------------|:--------------:|--------------:|
| Left | Center | Right |
| Text | Text | Text |

### Complex Table

| Framework | Language | Stars | First Release | License |
|-----------|----------|-------|---------------|---------|
| Vue.js | JavaScript | 200k+ | 2014 | MIT |
| React | JavaScript | 220k+ | 2013 | MIT |
| Angular | TypeScript | 90k+ | 2016 | MIT |
| Svelte | JavaScript | 75k+ | 2016 | MIT |

## Blockquotes

### Simple Quote

> This is a blockquote. It can span multiple lines.
> 
> And include multiple paragraphs.

### Nested Quotes

> This is the first level of quoting.
>
> > This is a nested blockquote.
>
> Back to the first level.

### Quote with Attribution

> "The best way to predict the future is to invent it."
> 
> — Alan Kay

## Mathematical Expressions

Inline math: $E = mc^2$

Block math:

$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

Another example:

$$
\int_{a}^{b} f(x) \, dx = F(b) - F(a)
$$

## Horizontal Rules

---

***

___

## Definition Lists

Term 1
: Definition 1a
: Definition 1b

Term 2
: Definition 2

## Footnotes

This is a sentence with a footnote[^1].

Another sentence with a footnote[^2].

[^1]: This is the first footnote.
[^2]: This is the second footnote.

## Abbreviations

The HTML specification is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]: World Wide Web Consortium

## Details/Summary

<details>
<summary>Click to expand</summary>

This is the hidden content that can be expanded by clicking the summary.

- It can contain lists
- And other formatting
- Like **bold** and *italic*

</details>

## Keyboard Keys

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.

Press <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste.

## Marked Text

==This text is marked/highlighted==

## Subscript and Superscript

H~2~O is water.

X^2^ + Y^2^ = Z^2^

## Emoji

:smile: :heart: :rocket: :fire: :thumbsup:

## Alerts/Callouts

> [!NOTE]
> This is a note callout.

> [!TIP]
> This is a tip callout.

> [!IMPORTANT]
> This is an important callout.

> [!WARNING]
> This is a warning callout.

> [!CAUTION]
> This is a caution callout.

## Conclusion

This guide covers most Markdown syntax elements. If you find any rendering issues, please let us know!

Happy writing! ✍️