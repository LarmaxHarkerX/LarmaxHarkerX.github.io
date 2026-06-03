import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-md'
import prism from 'markdown-it-prism'
import { setupMarkdownEnhancements } from './src/utils/markdown/externalLinksPlugin'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/],
      }),
      Markdown({
        markdownItSetup(md) {
          setupMarkdownEnhancements(md)
          md.use(prism)
        },
      }),
    ],
    base: env.VITE_BASE_PATH || '/',
  }
})
