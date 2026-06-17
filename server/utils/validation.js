const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const safeTrim = (value) => (typeof value === 'string' ? value.trim() : '')

const normalizeEmail = (value = '') => safeTrim(value).toLowerCase()

const isValidEmail = (value = '') => EMAIL_RE.test(normalizeEmail(value))

const isNonEmptyString = (value) => safeTrim(value).length > 0

const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const sanitizeSongTitle = (value) => {
  const cleaned = safeTrim(String(value || '').replace(/[^a-zA-Z0-9 ]/g, ''))
  return cleaned || 'unknown'
}

module.exports = {
  escapeRegex,
  isNonEmptyString,
  isValidEmail,
  normalizeEmail,
  safeTrim,
  sanitizeSongTitle,
}
