# Cloudinary Integration Setup Guide

This document explains the Cloudinary integration in Symponify, which provides persistent cloud-based storage for all music uploads and cover images.

## Table of Contents

1. [Overview](#overview)
2. [Why Cloudinary?](#why-cloudinary)
3. [Getting Started](#getting-started)
4. [Configuration](#configuration)
5. [How Uploads Work](#how-uploads-work)
6. [Troubleshooting](#troubleshooting)
7. [Deployment Notes](#deployment-notes)

## Overview

Symponify uses **Cloudinary** for all media storage. This means:

- Audio files (MP3, WAV, OGG, M4A) are stored on Cloudinary servers
- Cover images (JPG, PNG, WEBP) are stored on Cloudinary servers
- Permanent HTTPS URLs are stored in MongoDB
- No local filesystem dependency
- Full availability across server restarts and redeployments

## Why Cloudinary?

### Problems with Local Storage

The original Symponify used local disk storage via Multer, which had critical issues:

1. **Ephemeral Storage**: On Render's free tier, the filesystem is wiped on every redeploy
2. **File Loss**: Uploaded songs disappeared after server restarts
3. **No Redundancy**: No backup or recovery mechanism
4. **Scaling Issues**: Difficult to scale with multiple server instances
5. **CDN Limitations**: No automatic caching or global distribution

### Cloudinary Solutions

Cloudinary addresses all of these issues:

✅ **Persistent Storage**: Files remain forever unless explicitly deleted
✅ **Automatic CDN**: Files are cached globally for fast streaming
✅ **Reliability**: Built-in redundancy and disaster recovery
✅ **Easy Integration**: Simple Multer adapter (`multer-storage-cloudinary`)
✅ **Admin Dashboard**: Manage, preview, and delete files easily
✅ **Scalability**: Works seamlessly with multiple server instances

## Getting Started

### 1. Create a Cloudinary Account

1. Go to https://cloudinary.com
2. Click "Sign Up" and create a free account
3. Verify your email
4. You'll be taken to your dashboard

### 2. Get Your API Credentials

1. In the Cloudinary dashboard, go to **Settings** → **API Keys**
2. You'll see three important values:
   - **Cloud Name**: Unique identifier (e.g., `dxyz12345`)
   - **API Key**: Public key for API access (e.g., `123456789012345`)
   - **API Secret**: Private key (keep secret!) (e.g., `abcdef-ghijkl-mnopqr`)

⚠️ **IMPORTANT**: Never commit your API Secret to version control. Always use environment variables.

### 3. Set Environment Variables

Create or update `server/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Replace the values with your actual credentials from the Cloudinary dashboard.

## Configuration

### Environment Variables (Required)

All three environment variables are **required** for uploads to work:

| Variable | Description | Example |
|----------|-------------|---------|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `dxyz12345` |
| `CLOUDINARY_API_KEY` | Public API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Private API secret (keep secure!) | `abcdef-ghijkl-mnopqr` |

### Backend Configuration

The Cloudinary configuration is in `server/config/cloudinary.js`:

```javascript
// Automatically initializes on startup if all env vars are set
if (hasCloudinaryConfig()) {
  cloudinary.config({
    secure: true,
    ...getCloudinaryEnv(),
  })
}
```

**Key Functions:**

- `hasCloudinaryConfig()` - Checks if all required env vars are set
- `ensureCloudinaryConfigured()` - Throws error if not configured (called before uploads)
- `getUploadedFileUrl(file)` - Extracts the Cloudinary URL from upload response
- `deleteCloudinaryAsset(publicId)` - Removes an asset from Cloudinary

### Upload Middleware

The Multer upload middleware is in `server/middleware/upload.js`:

**Configuration:**

```javascript
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'symponify/audio' or 'symponify/covers', // Organized folders
      public_id: `${title}-${type}-${timestamp}`, // Unique ID
      resource_type: 'auto', // Auto-detect type
      unique_filename: true, // Prevent overwrites
      overwrite: false,
    }
  },
})
```

**File Size Limits:**

- Maximum file size: **50 MB** per file
- Audio formats: MP3, WAV, OGG, M4A
- Image formats: JPG, PNG, WEBP

## How Uploads Work

### Upload Flow

1. **User selects files** in the frontend (AddSong.jsx or ManageSongs.jsx)
2. **FormData is sent** to `POST /api/songs/upload` or `PUT /api/songs/:id/media`
3. **Multer intercepts** the request and uploads files to Cloudinary
4. **Response contains** Cloudinary secure URLs (e.g., `https://res.cloudinary.com/...`)
5. **MongoDB stores** both the URL and public ID
6. **Frontend receives** the song object with `audioUrl` and `coverUrl`

### Example Upload Response

```json
{
  "message": "Song uploaded successfully.",
  "song": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My Song",
    "artist": "My Artist",
    "audioUrl": "https://res.cloudinary.com/dxyz12345/video/upload/v123456/symponify/audio/my-song-audio-1234567890.mp3",
    "audioPublicId": "symponify/audio/my-song-audio-1234567890",
    "coverUrl": "https://res.cloudinary.com/dxyz12345/image/upload/v123456/symponify/covers/my-song-cover-1234567890.png",
    "coverPublicId": "symponify/covers/my-song-cover-1234567890",
    "audioReady": true,
    "coverReady": true,
    ...
  }
}
```

### Deletion Flow

When a song is deleted:

1. The database record is removed
2. `deleteCloudinaryAsset()` is called with the `audioPublicId`
3. `deleteCloudinaryAsset()` is called with the `coverPublicId`
4. Cloudinary removes both files permanently
5. CDN cache is invalidated

## Troubleshooting

### Issue: "Cloudinary is not configured"

**Symptom**: Upload fails with error "Cloudinary is not configured..."

**Solution**:
1. Check that all three env vars are set in `server/.env`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
2. Restart the server after setting env vars
3. Verify the values are correct (no typos, extra spaces)

**Local Debug**:
```bash
node -e "console.log(process.env.CLOUDINARY_CLOUD_NAME)"
# Should print your cloud name
```

### Issue: Files upload but return error on frontend

**Symptom**: Upload endpoint returns 500 error, but files appear in Cloudinary dashboard

**Solution**:
1. Check server logs for the exact error message
2. Verify file sizes are under 50 MB
3. Ensure file types are supported (MP3/WAV/OGG/M4A for audio)
4. Check that MongoDB is connected (Song model might fail to save)

### Issue: "Only MP3, WAV, OGG, and M4A audio files are allowed"

**Symptom**: Upload fails with file type error

**Solution**:
- Ensure your audio file has the correct extension
- Supported types: `.mp3`, `.wav`, `.ogg`, `.m4a`
- If file is valid, rename it with correct extension

### Issue: "Only JPG, PNG, and WEBP image files are allowed"

**Symptom**: Cover image upload fails

**Solution**:
- Ensure image has correct extension
- Supported types: `.jpg`, `.jpeg`, `.png`, `.webp`
- If file is valid, rename it with correct extension

### Issue: Frontend can't stream audio from Cloudinary URL

**Symptom**: Audio player shows URL but won't play

**Solution**:
1. Check browser console for CORS errors
2. Ensure Cloudinary CORS is configured (usually automatic)
3. Try the URL directly in your browser
4. Check if file exists in Cloudinary dashboard
5. Verify the `audioUrl` field is a valid HTTPS URL

### Issue: Uploads worked locally but not on Render

**Symptom**: Uploads fail only on deployed server

**Solution**:
1. Verify Cloudinary env vars are set in Render dashboard
2. Check Render's "Environment" tab has all three variables
3. Ensure no typos in env var names or values
4. Redeploy after setting env vars
5. Check server logs: `Render Dashboard → Logs`

## Deployment Notes

### Render Deployment

When deploying to Render:

1. **Set Environment Variables**:
   - Go to Render Dashboard → Select your service
   - Environment tab → Add the three Cloudinary variables
   - Values from `server/.env` (your local copy)

2. **No Media Files Needed**:
   - ~~Don't worry about uploading `server/public/songs`~~
   - Render no longer needs to store media files
   - All files are in Cloudinary

3. **Restart After Env Changes**:
   - After setting env vars, manually restart the service
   - Or redeploy with updated env vars

4. **Monitor Logs**:
   - Check `Render Logs` for Cloudinary configuration messages
   - Should see: `[Cloudinary] Configured with cloud_name: xxx`

### Vercel Frontend Deployment

The frontend needs no changes. Cloudinary URLs are already HTTPS and globally cached.

**Note on Vercel rewrites** (`client/vercel.json`):
- Remove the `/songs/*` rewrite (no longer needed)
- Keep the `/api/*` rewrite for API calls

Example `vercel.json` after migration:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://your-render-url.com/api/$1" }
  ]
}
```

### Database Migration

If you have existing local media files:

1. **Export existing songs**: Get all song records from MongoDB
2. **Re-upload to Cloudinary**: Use the admin UI to upload new versions
3. **Update MongoDB**: Set new `audioUrl`, `audioPublicId`, `coverUrl`, `coverPublicId`
4. **Delete old assets**: Remove from `server/public/songs` locally

See the main README for migration steps.

## Advanced Configuration

### Custom Cloudinary Folder Structure

Edit `server/middleware/upload.js` to change folder organization:

```javascript
const getUploadFolder = (file) => {
  // Current: symponify/audio or symponify/covers
  // Custom example: by-date
  const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  return file.fieldname === 'audio' ? `symponify/audio/${date}` : `symponify/covers/${date}`
}
```

### Increase File Size Limit

Edit `server/middleware/upload.js`:

```javascript
module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB instead of 50 MB
})
```

### Additional Cloudinary Features

Cloudinary offers many advanced features not currently used:

- **Transformations**: Resize, crop, optimize images on-the-fly
- **Adaptive Bitrate**: Automatically optimize audio quality
- **Watermarking**: Add watermarks to uploaded images
- **Signed URLs**: Restrict access to uploads
- **Webhooks**: Trigger actions on upload completion

See Cloudinary docs: https://cloudinary.com/documentation

## Summary

✅ **All uploads are now persistent**
✅ **Files are globally distributed via CDN**
✅ **No local filesystem dependency**
✅ **Easy file management in Cloudinary dashboard**
✅ **Seamless Render deployment**

For questions or issues, check the troubleshooting section above or consult the main README.
