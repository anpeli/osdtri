import { parse } from 'yaml'

const settingsFiles = import.meta.glob('../content/settings/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
})

const parseSettings = (source) => {
  const match = source?.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  return match ? parse(match[1]) || {} : {}
}

export const pageSettings = Object.fromEntries(
  Object.entries(settingsFiles).map(([path, source]) => [
    path.split('/').pop().replace(/\.md$/, ''),
    parseSettings(source)
  ])
)

export const getPageSettings = (page) => {
  const settings = pageSettings[page]
  if (!settings) {
    throw new Error(`Missing settings for page "${page}"`)
  }
  return settings
}
