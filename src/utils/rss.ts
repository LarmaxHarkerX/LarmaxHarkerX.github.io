import { Feed } from 'feed'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'

interface Post {
  title: string
  date: string
  description: string
  slug: string
  content: string
}

async function getPosts(): Promise<Post[]> {
  const files = await glob('posts/*.md')
  
  return files.map((file) => {
    const content = readFileSync(file, 'utf-8')
    const { data, content: markdownContent } = matter(content)
    const slug = file.replace('posts/', '').replace('.md', '')
    
    return {
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      description: data.description || '',
      slug,
      content: markdownContent,
    }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function generateRSS() {
  const posts = await getPosts()
  
  const feed = new Feed({
    title: 'LARMAX Blog',
    description: 'A terminal-style blog for developers',
    id: 'https://larmax.github.io/',
    link: 'https://larmax.github.io/',
    language: 'zh-CN',
    image: 'https://larmax.github.io/favicon.svg',
    favicon: 'https://larmax.github.io/favicon.ico',
    copyright: `Copyright © ${new Date().getFullYear()} LARMAX`,
    feedLinks: {
      rss2: 'https://larmax.github.io/feed.xml',
      atom: 'https://larmax.github.io/atom.xml',
      json: 'https://larmax.github.io/feed.json',
    },
  })
  
  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `https://larmax.github.io/blog/${post.slug}`,
      link: `https://larmax.github.io/blog/${post.slug}`,
      description: post.description,
      content: post.content,
      date: new Date(post.date),
    })
  })
  
  // Ensure dist directory exists
  const distDir = resolve(process.cwd(), 'dist')
  mkdirSync(distDir, { recursive: true })
  
  // Write feed files
  writeFileSync(resolve(distDir, 'feed.xml'), feed.rss2())
  writeFileSync(resolve(distDir, 'atom.xml'), feed.atom1())
  writeFileSync(resolve(distDir, 'feed.json'), feed.json1())
  
  console.log('RSS feeds generated successfully!')
}