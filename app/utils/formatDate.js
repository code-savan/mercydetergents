export function formatRelativeDate(date) {
  const now = new Date()
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = (now - d) / 1000 // seconds

  if (diff < 30) return 'just now'
  if (diff < 60) return `${Math.floor(diff)} seconds ago`
  if (diff < 3600) {
    const mins = Math.floor(diff / 60)
    return mins === 1 ? '1 minute ago' : `${mins} minutes ago`
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600)
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`
  }
  if (diff < 604800) {
    const days = Math.floor(diff / 86400)
    return days === 1 ? '1 day ago' : `${days} days ago`
  }
  if (diff < 2592000) {
    const weeks = Math.floor(diff / 604800)
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  }
  // fallback to date string
  return d.toLocaleDateString()
}
