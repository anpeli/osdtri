const getLocalDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatEventDate = (date, now = new Date()) => {
  if (!date) return ''

  const dateKey = typeof date === 'string' ? date.slice(0, 10) : new Date(date).toISOString().slice(0, 10)
  const todayKey = getLocalDateKey(now)

  if (dateKey === todayKey) return 'Idag'

  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  if (dateKey === getLocalDateKey(tomorrow)) return 'Imorgon'

  return new Date(`${dateKey}T00:00:00Z`).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
}
