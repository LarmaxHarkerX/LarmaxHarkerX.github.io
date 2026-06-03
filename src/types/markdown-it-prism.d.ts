declare module 'markdown-it-prism' {
  import type MarkdownIt from 'markdown-it'

  const markdownItPrism: (md: MarkdownIt) => void
  export default markdownItPrism
}
