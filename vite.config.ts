import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-md'
import prism from 'markdown-it-prism'

// Plugin to add target="_blank" to all links
function externalLinksPlugin(md: any) {
  const defaultRender = md.renderer.rules.link_open || function(tokens: any[], idx: number, options: any, _env: any, self: any) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.link_open = function(tokens: any[], idx: number, options: any, env: any, self: any) {
    const token = tokens[idx]
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
    return defaultRender(tokens, idx, options, env, self)
  }
}

export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({
      markdownItSetup(md) {
        md.use(prism)
        md.use(externalLinksPlugin)
      },
    }),
  ],
  base: '/LARMAX_BLOG/',
})
