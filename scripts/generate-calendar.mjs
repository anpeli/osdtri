import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const eventsDirectory = resolve('src/content/events')
const outputPath = resolve('dist/events.ics')

const escapeText = (value) => String(value)
  .replace(/\\/g, '\\\\')
  .replace(/\r\n|\r|\n/g, '\\n')
  .replace(/;/g, '\\;')
  .replace(/,/g, '\\,')

const foldLine = (line) => {
  const folded = []
  let current = ''
  let byteLength = 0

  for (const character of line) {
    const characterLength = Buffer.byteLength(character)
    if (byteLength + characterLength > 75) {
      folded.push(current)
      current = ` ${character}`
      byteLength = 1 + characterLength
    } else {
      current += character
      byteLength += characterLength
    }
  }

  folded.push(current)
  return folded.join('\r\n')
}

const toDateKey = (value, fileName) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value))
  if (!match) throw new Error(`Invalid event date in ${fileName}: ${value}`)

  const [, year, month, day] = match
  const parsed = new Date(`${year}-${month}-${day}T00:00:00Z`)
  if (parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid event date in ${fileName}: ${value}`)
  }

  return `${year}${month}${day}`
}

const markdownToText = (markdown) => markdown
  .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
  .replace(/^\s{0,3}#{1,6}\s+/gm, '')
  .replace(/^\s*[-*+]\s+/gm, '- ')
  .replace(/[*_~`]/g, '')
  .trim()

export const generateCalendar = () => {
  const today = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())

  const readEvents = () => readdirSync(eventsDirectory)
  .filter((fileName) => fileName.endsWith('.md'))
  .map((fileName) => {
    const source = readFileSync(resolve(eventsDirectory, fileName), 'utf8')
    const frontMatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source)
    const metadata = frontMatter ? parse(frontMatter[1]) || {} : {}

    if (!metadata.title || !metadata.date) return null

    const dateKey = toDateKey(metadata.date, fileName)
    if (`${dateKey.slice(0, 4)}-${dateKey.slice(4, 6)}-${dateKey.slice(6)}` < today) return null

    if (metadata.time && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(metadata.time)) {
      throw new Error(`Invalid event time in ${fileName}: ${metadata.time}`)
    }

    return {
      fileName,
      metadata,
      dateKey,
      description: markdownToText(String(metadata.description || (frontMatter ? frontMatter[2] : '') || ''))
    }
  })
  .filter(Boolean)
  .sort((first, second) => first.dateKey.localeCompare(second.dateKey)
    || String(first.metadata.time || '').localeCompare(String(second.metadata.time || '')))

  const events = readEvents()
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const lines = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//OSD Tri//Event Calendar//SV',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  'X-WR-CALNAME:OSD Tri - Kalender',
  'X-WR-TIMEZONE:Europe/Stockholm',
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Stockholm',
  'X-LIC-LOCATION:Europe/Stockholm',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19800330T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19801026T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE'
  ]

  for (const { fileName, metadata, dateKey, description } of events) {
    const uid = `${basename(fileName, '.md')}@osdtri.se`
    const start = metadata.time
      ? `${dateKey}T${metadata.time.replace(':', '')}00`
      : dateKey

    lines.push(
      'BEGIN:VEVENT',
      `UID:${escapeText(uid)}`,
      `DTSTAMP:${stamp}`,
      metadata.time
        ? `DTSTART;TZID=Europe/Stockholm:${start}`
        : `DTSTART;VALUE=DATE:${start}`,
      ...(!metadata.time ? [`DTEND;VALUE=DATE:${addOneDay(dateKey)}`] : []),
      `SUMMARY:${escapeText(metadata.title)}`
    )

    if (metadata.location) lines.push(`LOCATION:${escapeText(metadata.location)}`)
    if (description) lines.push(`DESCRIPTION:${escapeText(description)}`)
    if (metadata.facebookUrl) {
      const url = new URL(metadata.facebookUrl)
      if (url.protocol === 'http:' || url.protocol === 'https:') lines.push(`URL:${url.href}`)
    }

    const duration = /^(\d+)\s*(timm(?:e|ar)|minut(?:|er))$/i.exec(String(metadata.duration || '').trim())
    if (metadata.time && duration) {
      lines.push(`DURATION:PT${duration[2].toLowerCase().startsWith('minut') ? `${duration[1]}M` : `${duration[1]}H`}`)
    }

    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')
  return `${lines.map(foldLine).join('\r\n')}\r\n`

  function addOneDay(dateKey) {
    const date = new Date(`${dateKey.slice(0, 4)}-${dateKey.slice(4, 6)}-${dateKey.slice(6)}T00:00:00Z`)
    date.setUTCDate(date.getUTCDate() + 1)
    return date.toISOString().slice(0, 10).replace(/-/g, '')
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  writeFileSync(outputPath, generateCalendar(), 'utf8')
}
