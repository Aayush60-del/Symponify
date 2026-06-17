const path = require('path')
const { sanitizeSongTitle } = require('./validation')

/**
 * Path to local media root (now only used for legacy fallback).
 * All new uploads go to Cloudinary, not local filesystem.
 */
const mediaRoot = path.join(__dirname, '../public/songs')

/**
 * Checks if a URL is a remote URL (Cloudinary, HTTP, HTTPS, etc).
 * Cloudinary URLs always start with https://, so this returns true for them.
 * @param {string} value - URL to check
 * @returns {boolean} true if URL is remote (Cloudinary or other HTTPS URL)
 */
const isRemoteUrl = (value = '') => /^https?:\/\//i.test(String(value))

/**
 * Builds a local media URL (legacy, for backward compatibility).
 * For new uploads, Cloudinary URLs are used instead.
 * @param {Object} req - Express request (unused, for API compatibility)
 * @param {string} folderName - Song title or album name
 * @param {string} filename - File name (audio.mp3, cover.webp, etc)
 * @returns {string} Path like /songs/Song%20Name/audio.mp3
 */
const buildMediaUrl = (_req, folderName, filename) => `/songs/${encodeURIComponent(sanitizeSongTitle(folderName))}/${filename}`

/**
 * Extracts relative path from a URL.
 * Handles both local paths (/songs/...) and remote URLs (returns empty).
 * @param {string} mediaUrl - Media URL or path
 * @returns {string} Relative path or empty string for remote URLs
 */
const getMediaRelativePath = (mediaUrl) => {
  if (!mediaUrl || isRemoteUrl(mediaUrl)) return ''

  try {
    const parsed = new URL(mediaUrl)
    const relativePath = decodeURIComponent(parsed.pathname.replace(/^\/songs\//, ''))
    return !relativePath || relativePath === parsed.pathname ? '' : relativePath
  } catch {
    const normalized = decodeURIComponent(String(mediaUrl).replace(/^\/songs\//, '').replace(/^songs\//, ''))
    return normalized && normalized !== mediaUrl ? normalized : ''
  }
}

/**
 * Converts a media URL to a local filesystem path.
 * Only works for local URLs. Cloudinary URLs return empty string.
 * @param {string} mediaUrl - Media URL
 * @returns {string} Local filesystem path or empty string for remote URLs
 */
const getLocalMediaPath = (mediaUrl) => {
  const relativePath = getMediaRelativePath(mediaUrl)
  return relativePath ? path.join(mediaRoot, relativePath) : ''
}

/**
 * Normalizes media URLs.
 * - Passes through Cloudinary/HTTPS URLs unchanged
 * - Converts local paths to /songs/... format
 * - Empty/invalid URLs return as-is
 * @param {Object} req - Express request (unused, for API compatibility)
 * @param {string} mediaUrl - Media URL or path
 * @returns {string} Normalized URL
 */
const normalizeMediaUrl = (_req, mediaUrl) => {
  if (!mediaUrl) return ''
  
  // Cloudinary and other HTTPS URLs are passed through as-is
  if (isRemoteUrl(mediaUrl)) return mediaUrl

  const relativePath = getMediaRelativePath(mediaUrl)
  if (!relativePath) return mediaUrl || ''

  const parts = relativePath.split(/[\\/]/)
  if (parts.length < 2) return mediaUrl || ''

  const filename = parts.pop()
  const folderName = parts.join('/')
  return buildMediaUrl(null, folderName, filename)
}

/**
 * Adds media flags to a song object for API responses.
 * - Normalizes audioUrl and coverUrl
 * - Adds audioReady and coverReady flags
 * - Cloudinary URLs are returned as-is
 * @param {Object} req - Express request
 * @param {Object} song - Song document
 * @returns {Object} Song with normalized URLs and media flags
 */
const withMediaFlags = (req, song) => {
  const audioUrl = normalizeMediaUrl(req, song.audioUrl)
  const coverUrl = normalizeMediaUrl(req, song.coverUrl)

  return {
    ...song,
    audioUrl,
    coverUrl,
    audioReady: Boolean(audioUrl),
    coverReady: !coverUrl || Boolean(coverUrl),
  }
}

module.exports = {
  buildMediaUrl,
  getLocalMediaPath,
  getMediaRelativePath,
  isRemoteUrl,
  mediaRoot,
  normalizeMediaUrl,
  withMediaFlags,
}
