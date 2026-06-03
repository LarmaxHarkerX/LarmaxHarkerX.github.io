import type MarkdownIt from 'markdown-it'

const fenceLanguageAliases: Record<string, string> = {
  bash: 'bash',
  shell: 'bash',
  sh: 'bash',
  bat: 'batch',
  cmd: 'batch',
  dos: 'batch',
  ps1: 'powershell',
  powershell: 'powershell',
}

function normalizeFenceLanguage(info: string) {
  const [language, ...rest] = info.trim().split(/\s+/)

  if (!language) {
    return info
  }

  const normalizedLanguage = fenceLanguageAliases[language.toLowerCase()] ?? language.toLowerCase()
  return [normalizedLanguage, ...rest].join(' ')
}

export function setupMarkdownEnhancements(md: MarkdownIt) {
  md.core.ruler.push('normalize-fence-languages', (state) => {
    for (const token of state.tokens) {
      if (token.type === 'fence' && token.info) {
        token.info = normalizeFenceLanguage(token.info)
      }
    }
  })

  const defaultRender = md.renderer.rules.link_open ?? ((tokens, index, options, _env, self) => {
    return self.renderToken(tokens, index, options)
  })

  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const token = tokens[index]
    const href = token.attrGet('href') || ''

    if (!href.startsWith('#')) {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'noopener noreferrer')
    }

    return defaultRender(tokens, index, options, env, self)
  }
}
