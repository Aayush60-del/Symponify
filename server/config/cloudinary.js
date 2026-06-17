const { v2: cloudinary } = require('cloudinary')
const path = require('path')

/**
 * Retrieves Cloudinary configuration from environment variables.
 * @returns {Object} Cloudinary config object
 */
const getCloudinaryEnv = () => ({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
})

/**
 * Checks if Cloudinary is properly configured with all required env vars.
 * @returns {boolean} true if all required env vars are set
 */
const hasCloudinaryConfig = () => {
  const env = getCloudinaryEnv()
  return Boolean(env.cloud_name && env.api_key && env.api_secret)
}

/**
 * Initialize Cloudinary configuration if env vars are available.
 * This enables all upload and asset management operations.
 */
if (hasCloudinaryConfig()) {
  cloudinary.config({
    secure: true,
    ...getCloudinaryEnv(),
  })
  console.log(`[Cloudinary] Configured with cloud_name: ${process.env.CLOUDINARY_CLOUD_NAME}`)
} else {
  console.warn('[Cloudinary] Not configured - uploads will fail. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.')
}

/**
 * Validates Cloudinary configuration and throws an error if missing.
 * Call this before any upload or deletion operation.
 * @throws {Error} If Cloudinary is not configured
 */
const ensureCloudinaryConfigured = () => {
  if (hasCloudinaryConfig()) return

  const error = new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.')
  error.status = 500
  throw error
}

/**
 * Extracts the secure URL from an uploaded file object.
 * @param {Object} file - Multer file object from Cloudinary
 * @returns {string} Cloudinary secure URL for the asset
 */
const getUploadedFileUrl = (file) => file?.secure_url || file?.path || ''

/**
 * Extracts the public ID from an uploaded file object.
 * The public ID is used to delete or update the asset later.
 * @param {Object} file - Multer file object from Cloudinary
 * @returns {string} Cloudinary public ID
 */
const getUploadedFilePublicId = (file) => file?.filename || file?.public_id || ''

// When using local disk storage, multer provides `file.path` which is an absolute
// filesystem path (e.g. /.../server/public/songs/Title/1234-audio.mp3). Convert
// that to a public URL path under /songs/... so clients can fetch it.
const convertLocalPathToUrl = (p) => {
  if (!p) return ''
  try {
    const normalized = p.replace(/\\/g, '/')
    const idx = normalized.indexOf('/public/songs/')
    if (idx === -1) return ''
    return normalized.slice(idx + '/public'.length)
  } catch {
    return ''
  }
}

const getUploadedFileUrlNormalized = (file) => {
  if (!file) return ''
  if (file.secure_url) return file.secure_url
  if (file.path) {
    const url = convertLocalPathToUrl(file.path)
    return url || file.path
  }
  return ''
}

/**
 * Deletes an asset from Cloudinary by resource type.
 * Tries up to 3 times if initial deletion fails.
 * @param {string} publicId - Cloudinary public ID of the asset
 * @param {string} resourceType - 'image', 'video', 'raw', or 'auto'
 * @returns {Promise<Object|null>} Deletion result or null on failure
 */
const destroyByResourceType = async (publicId, resourceType) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: resourceType,
    })

    return result
  } catch {
    return null
  }
}

/**
 * Deletes an asset from Cloudinary by trying all possible resource types.
 * Automatically detects and removes the correct resource type.
 * Safe to call even if public ID doesn't exist (no error thrown).
 * @param {string} publicId - Cloudinary public ID of the asset
 * @returns {Promise<void>}
 */
const deleteCloudinaryAsset = async (publicId) => {
  if (!publicId || !hasCloudinaryConfig()) return

  const resourceTypes = ['image', 'video', 'raw']
  for (const resourceType of resourceTypes) {
    const result = await destroyByResourceType(publicId, resourceType)
    if (result && (result.result === 'ok' || result.result === 'not found')) {
      return
    }
  }
}

module.exports = {
  cloudinary,
  deleteCloudinaryAsset,
  ensureCloudinaryConfigured,
  getUploadedFilePublicId,
  getUploadedFileUrl,
  hasCloudinaryConfig,
}

