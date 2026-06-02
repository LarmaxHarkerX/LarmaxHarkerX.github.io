import { useHead } from '@unhead/vue'

interface SEOOptions {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
}

export function useSEO(options: SEOOptions = {}) {
  const {
    title = 'LARMAX Blog',
    description = 'A terminal-style blog for developers',
    image = '/og-image.png',
    url = 'https://larmax.github.io',
    type = 'website',
  } = options

  const fullTitle = title === 'LARMAX Blog' ? title : `${title} | LARMAX Blog`

  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: description },
      { name: 'og:title', content: fullTitle },
      { name: 'og:description', content: description },
      { name: 'og:image', content: image },
      { name: 'og:url', content: url },
      { name: 'og:type', content: type },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    link: [
      { rel: 'canonical', href: url },
      { rel: 'alternate', type: 'application/rss+xml', title: 'RSS', href: '/feed.xml' },
      { rel: 'alternate', type: 'application/atom+xml', title: 'Atom', href: '/atom.xml' },
    ],
  })
}