import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'
import { adminSongsService, albumsService } from '../lib/services'
import { useToast } from '../context/ToastContext'
import useViewport from '../hooks/useViewport'

const initialForm = {
  title: '',
  artist: '',
  album: '',
  duration: '',
  genre: '',
  emoji: '\uD83C\uDFB5',
  color: 'linear-gradient(135deg,#FF5C35,#F0A500)',
}

const genres = ['Pop', 'Rock', 'Jazz', 'Bollywood', 'Electronic', 'Chill', 'Hip-Hop', 'Classical']
const emojis = ['\uD83C\uDFB8', '\uD83C\uDFA4', '\uD83C\uDFB9', '\uD83E\uDD41', '\uD83C\uDFAA', '\uD83C\uDFBB', '\uD83C\uDF0A', '\uD83D\uDD25', '\uD83C\uDF38', '\uD83C\uDF3F', '\uD83C\uDF0C', '\u2728']
const colors = [
  'linear-gradient(135deg,#FF5C35,#F0A500)',
  'linear-gradient(135deg,#1a3c5e,#4a90d9)',
  'linear-gradient(135deg,#2D6A4F,#74C69D)',
  'linear-gradient(135deg,#7B2D8B,#C77DFF)',
  'linear-gradient(135deg,#1a1a1a,#555555)',
  'linear-gradient(135deg,#C9184A,#FF758F)',
  'linear-gradient(135deg,#0d1b3e,#3d1a6e)',
  'linear-gradient(135deg,#B5500A,#F0A500)',
]

const styles = {
  page: {
    padding: 'clamp(0.75rem, 2.5vw, 1.75rem)',
    overflowY: 'auto',
    height: '100%',
  },
  hero: {
    marginBottom: '22px',
    padding: 'clamp(1rem, 3vw, 1.75rem)',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, rgba(255,92,53,0.14), rgba(240,165,0,0.22))',
    border: '1px solid rgba(255,92,53,0.12)',
  },
  eyebrow: {
    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-3)',
    fontWeight: 700,
    marginBottom: '8px',
  },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(1.875rem, 4vw, 2.375rem)',
    marginBottom: '10px',
  },
  copy: {
    color: 'var(--text-2)',
    lineHeight: 1.6,
    maxWidth: '60ch',
    fontSize: 'clamp(0.875rem, 1.2vw, 0.95rem)',
  },
  heroMeta: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '16px',
  },
  pill: {
    padding: '9px 14px',
    borderRadius: '999px',
    background: 'var(--surface-elevated)',
    border: '1px solid var(--line)',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-2)',
  },
  card: {
    width: '100%',
    maxWidth: '860px',
    background: 'var(--card-bg)',
    backdropFilter: 'blur(10px)',
    border: '1px solid var(--line)',
    borderRadius: '30px',
    padding: 'clamp(1rem, 3vw, 1.75rem)',
    boxShadow: 'var(--shadow)',
    marginInline: 'auto',
  },
  heading: {
    fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
    fontWeight: 800,
    marginBottom: '22px',
  },
  msg: {
    padding: '13px 16px',
    borderRadius: '14px',
    fontSize: '13px',
    marginBottom: '18px',
    border: '1px solid',
  },
  uploadRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  uploadSection: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    gap: '10px',
    alignItems: 'stretch',
  },
  uploadBox: {
    border: '2px dashed var(--line-strong)',
    borderRadius: '18px',
    padding: 'clamp(1rem, 2.5vw, 1.5rem)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    minHeight: '160px',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    width: '100%',
  },
  uploadAction: {
    width: '44px',
    minWidth: '44px',
    height: '44px',
    borderRadius: '14px',
    border: '1px solid var(--line)',
    background: 'var(--surface-elevated)',
    color: 'var(--text-2)',
    cursor: 'pointer',
    fontWeight: 700,
    alignSelf: 'center',
  },
  uploadIcon: {
    fontSize: '26px',
    marginBottom: '10px',
    fontWeight: 800,
    letterSpacing: '0.06em',
  },
  uploadLabel: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: '6px',
  },
  uploadSub: {
    fontSize: '12px',
    color: 'var(--text-3)',
    wordBreak: 'break-word',
  },
  progressWrap: {
    marginBottom: '20px',
  },
  progressLabel: {
    fontSize: '12px',
    color: 'var(--text-2)',
    marginBottom: '6px',
    fontWeight: 700,
  },
  progressBar: {
    height: '8px',
    background: 'var(--surface-3)',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
    borderRadius: '999px',
    transition: 'width 0.3s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
    fontWeight: 700,
    color: 'var(--text-2)',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: 'clamp(0.75rem, 1.5vw, 0.875rem)',
    background: 'var(--input-bg)',
    border: '1px solid var(--line)',
    borderRadius: '14px',
    color: 'var(--text)',
    outline: 'none',
    fontSize: '1rem',
    minHeight: '44px',
  },
  emojiRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  emojiButton: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    border: '1px solid var(--line)',
    fontSize: '18px',
    cursor: 'pointer',
  },
  colorRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  colorButton: {
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
  },
  preview: {
    borderRadius: '22px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    minHeight: '96px',
  },
  previewImage: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  previewEmoji: {
    fontSize: '38px',
  },
  previewTitle: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#fff',
  },
  previewSub: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
    marginTop: '4px',
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
    marginTop: '10px',
  },
  button: {
    width: '100%',
    padding: '15px 18px',
    borderRadius: '999px',
    background: 'var(--text)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  secondaryButton: {
    width: '100%',
    padding: '15px 18px',
    borderRadius: '999px',
    background: 'var(--surface-2)',
    color: 'var(--text)',
    fontWeight: 700,
    cursor: 'pointer',
    border: '1px solid var(--line)',
  },
}

export default function AddSong() {
  const { user } = usePlayer()
  const { error: showError, success: showSuccess } = useToast()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState(initialForm)
  const [albums, setAlbums] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState('')
  const [newAlbumName, setNewAlbumName] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [audioName, setAudioName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [albumsLoading, setAlbumsLoading] = useState(true)
  const audioRef = useRef(null)
  const coverRef = useRef(null)
  const { isCompact, isMobile: isPhone, isWide } = useViewport()
  const preselectedAlbum = searchParams.get('album') || ''

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const data = await albumsService.getAll()
        setAlbums(data)
      } catch (err) {
        setAlbums([])
        showError('Failed to load albums')
      } finally {
        setAlbumsLoading(false)
      }
    }
    
    loadAlbums()
  }, [showError])

  useEffect(() => {
    if (!preselectedAlbum) return

    setSelectedAlbum(preselectedAlbum)
    setNewAlbumName('')
    setForm((prev) => ({
      ...prev,
      album: preselectedAlbum,
    }))
  }, [preselectedAlbum])

  useEffect(() => {
    return () => {
      if (coverPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreview)
      }
    }
  }, [coverPreview])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const resetAudio = () => {
    setAudioFile(null)
    setAudioName('')
    setForm((prev) => ({ ...prev, duration: '' }))
    if (audioRef.current) audioRef.current.value = ''
  }

  const resetCover = () => {
    if (coverPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreview)
    }
    setCoverFile(null)
    setCoverPreview(null)
    if (coverRef.current) coverRef.current.value = ''
  }

  const resetForm = () => {
    resetAudio()
    resetCover()
    setForm(initialForm)
    setSelectedAlbum('')
    setNewAlbumName('')
    setProgress(0)
    setMessage({ text: '', type: '' })
  }

  const pickAudio = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.size) {
      setMessage({ text: 'The selected audio file is empty. Choose a valid audio file.', type: 'error' })
      if (audioRef.current) audioRef.current.value = ''
      return
    }

    setAudioFile(file)
    setAudioName(file.name)
    setMessage({ text: '', type: '' })

    // Auto-parse filename for title and artist (assuming "Artist - Title" format)
    const fileNameNoExt = file.name.replace(/\.[^/.]+$/, '')
    let parsedArtist = ''
    let parsedTitle = fileNameNoExt
    if (fileNameNoExt.includes('-')) {
      const parts = fileNameNoExt.split('-')
      parsedArtist = parts[0].trim()
      parsedTitle = parts.slice(1).join('-').trim()
    }
    setForm((prev) => ({
      ...prev,
      title: prev.title || parsedTitle,
      artist: prev.artist || parsedArtist,
    }))

    const previewAudio = new Audio(URL.createObjectURL(file))
    previewAudio.onloadedmetadata = () => {
      const minutes = Math.floor(previewAudio.duration / 60)
      const seconds = Math.floor(previewAudio.duration % 60)
      setForm((prev) => ({ ...prev, duration: `${minutes}:${seconds.toString().padStart(2, '0')}` }))
      URL.revokeObjectURL(previewAudio.src)
    }
    previewAudio.onerror = () => {
      URL.revokeObjectURL(previewAudio.src)
    }
  }

  const pickCover = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.size) {
      setMessage({ text: 'The selected cover image is empty. Choose a valid image file.', type: 'error' })
      if (coverRef.current) coverRef.current.value = ''
      return
    }

    if (coverPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreview)
    }

    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
    setMessage({ text: '', type: '' })
  }

  const submit = async () => {
    if (!form.title.trim() || !form.artist.trim()) {
      const msg = 'Title and artist are required.'
      setMessage({ text: msg, type: 'error' })
      showError(msg)
      return
    }

    if (!audioFile) {
      const msg = 'Please select an audio file.'
      setMessage({ text: msg, type: 'error' })
      showError(msg)
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      const msg = 'You must be logged in to upload songs.'
      setMessage({ text: msg, type: 'error' })
      showError(msg)
      return
    }

    const finalAlbum = newAlbumName.trim() || selectedAlbum || form.album.trim()
    const formData = new FormData()

    formData.append('title', form.title)
    formData.append('artist', form.artist)
    formData.append('album', finalAlbum)
    formData.append('duration', form.duration)
    formData.append('genre', form.genre)
    formData.append('emoji', form.emoji)
    formData.append('color', form.color)
    formData.append('audio', audioFile)

    if (coverFile) {
      formData.append('cover', coverFile)
    }

    try {
      setUploading(true)
      setProgress(0)
      setMessage({ text: '', type: '' })

      const config = {
        onUploadProgress: (event) => {
          if (!event.total) return
          setProgress(Math.round((event.loaded / event.total) * 100))
        },
      }

      await adminSongsService.upload(formData, token, config)

      resetForm()
      const successMsg = 'Song uploaded successfully!'
      setMessage({ text: successMsg, type: 'success' })
      showSuccess(successMsg)
    } catch (error) {
      const errorMsg = `Upload failed: ${error.response?.data?.message || error.message || 'Unknown error'}`
      setMessage({ text: errorMsg, type: 'error' })
      showError(errorMsg)
    } finally {
      setUploading(false)
    }
  }

  if (!user?.isAdmin) {
    return (
      <div style={styles.page} className="scrollbar-hidden">
        <section style={styles.hero}>
          <div style={styles.eyebrow}>Admin Tools</div>
          <h1 style={styles.title}>Admin access only</h1>
          <p style={styles.copy}>The Add Song page is available only to admin users. Sign in again after your account has been granted admin access.</p>
        </section>
      </div>
    )
  }

  return (
    <div
      style={{
        ...styles.page,
        padding: isPhone ? '16px' : isCompact ? '22px' : styles.page.padding,
        width: '100%',
        maxWidth: isWide ? '1320px' : '100%',
        marginInline: 'auto',
      }}
      className="scrollbar-hidden"
    >
      <section style={{ ...styles.hero, padding: isPhone ? '20px' : styles.hero.padding }}>
        <div style={styles.eyebrow}>Admin Tools</div>
        <h1 style={{ ...styles.title, fontSize: isPhone ? '28px' : styles.title.fontSize }}>Upload a new song</h1>
        <div style={styles.heroMeta}>
          <span style={styles.pill}>Audio upload</span>
          <span style={styles.pill}>Cover preview</span>
          <span style={styles.pill}>Instant metadata</span>
        </div>
      </section>

      <section
        style={{
          ...styles.card,
          padding: isPhone ? '20px' : styles.card.padding,
          borderRadius: isPhone ? '24px' : styles.card.borderRadius,
          width: '100%',
        }}
      >
        <h2 style={styles.heading}>Add New Song</h2>

        {message.text ? (
          <div
            style={{
              ...styles.msg,
              background: message.type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
              borderColor: message.type === 'success' ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)',
              color: 'var(--text)',
            }}
          >
            {message.text}
          </div>
        ) : null}

        <div style={{ ...styles.uploadRow, gridTemplateColumns: isCompact ? 'minmax(0, 1fr)' : styles.uploadRow.gridTemplateColumns }}>
          <div style={{ ...styles.uploadSection, gridTemplateColumns: isPhone ? 'minmax(0, 1fr)' : styles.uploadSection.gridTemplateColumns }}>
            <button
              type="button"
              style={{
                ...styles.uploadBox,
                borderColor: audioFile ? 'var(--accent)' : 'var(--line-strong)',
                background: audioFile ? 'var(--accent-soft)' : 'var(--surface-2)',
              }}
              onClick={() => audioRef.current?.click()}
            >
              <input ref={audioRef} type="file" accept=".mp3,.wav,.ogg,.m4a" style={{ display: 'none' }} onChange={pickAudio} />
              <div style={styles.uploadIcon}>{audioFile ? 'OK' : 'AUDIO'}</div>
              <div style={styles.uploadLabel}>{audioFile ? 'Audio selected' : 'Upload audio'}</div>
              <div style={styles.uploadSub}>{audioName || 'MP3, WAV, OGG, M4A - max 50MB'}</div>
            </button>
            {audioFile ? (
              <button type="button" style={styles.uploadAction} onClick={resetAudio} aria-label="Remove audio">
                X
              </button>
            ) : null}
          </div>

          <div style={{ ...styles.uploadSection, gridTemplateColumns: isPhone ? 'minmax(0, 1fr)' : styles.uploadSection.gridTemplateColumns }}>
            <button
              type="button"
              style={{
                ...styles.uploadBox,
                borderColor: coverFile ? 'var(--accent)' : 'var(--line-strong)',
                background: coverFile ? 'var(--accent-soft)' : 'var(--surface-2)',
                overflow: 'hidden',
                padding: coverPreview ? 0 : '24px',
              }}
              onClick={() => coverRef.current?.click()}
            >
              <input ref={coverRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={pickCover} />
              {coverPreview ? (
                <img src={coverPreview} alt="cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <div style={styles.uploadIcon}>COVER</div>
                  <div style={styles.uploadLabel}>Upload cover</div>
                  <div style={styles.uploadSub}>JPG, PNG, WEBP - recommended 500x500</div>
                </>
              )}
            </button>
            {coverFile ? (
              <button type="button" style={styles.uploadAction} onClick={resetCover} aria-label="Remove cover">
                X
              </button>
            ) : null}
          </div>
        </div>

        {uploading ? (
          <div style={styles.progressWrap}>
            <div style={styles.progressLabel}>Uploading... {progress}%</div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
          </div>
        ) : null}

        <div style={{ ...styles.grid, gridTemplateColumns: isCompact ? 'minmax(0, 1fr)' : styles.grid.gridTemplateColumns }}>
          <div style={styles.field}>
            <label style={styles.label}>Song Title *</label>
            <input style={styles.input} name="title" placeholder="e.g. Tum Hi Ho" value={form.title} onChange={handleChange} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Artist *</label>
            <input style={styles.input} name="artist" placeholder="e.g. Arijit Singh" value={form.artist} onChange={handleChange} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Album Name</label>
            <input style={styles.input} name="album" placeholder="e.g. Aashiqui 2" value={form.album} onChange={handleChange} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Duration</label>
            <input style={styles.input} name="duration" placeholder="e.g. 4:22" value={form.duration} onChange={handleChange} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Genre</label>
            <select style={styles.input} name="genre" value={form.genre} onChange={handleChange}>
              <option value="">Select Genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Add To Existing Album</label>
            <select
              style={styles.input}
              value={selectedAlbum}
              onChange={(event) => {
                const value = event.target.value
                setSelectedAlbum(value)
                if (value) {
                  setForm((prev) => ({ ...prev, album: value }))
                  setNewAlbumName('')
                }
              }}
              disabled={Boolean(newAlbumName.trim()) || albumsLoading}
            >
              <option value="">{albumsLoading ? 'Loading albums...' : 'No album selected'}</option>
              {albums.map((album) => (
                <option key={album.title} value={album.title}>
                  {album.title}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Create New Album</label>
            <input
              style={styles.input}
              placeholder="e.g. Chill Collection"
              value={newAlbumName}
              onChange={(event) => {
                const value = event.target.value
                setNewAlbumName(value)
                setForm((prev) => ({ ...prev, album: value }))
                if (value.trim()) {
                  setSelectedAlbum('')
                }
              }}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Emoji Icon</label>
          <div style={styles.emojiRow}>
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                style={{
                  ...styles.emojiButton,
                  background: form.emoji === emoji ? 'var(--active-bg)' : 'var(--surface-2)',
                  color: form.emoji === emoji ? 'var(--active-text)' : 'var(--text)',
                }}
                onClick={() => setForm((prev) => ({ ...prev, emoji }))}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Card Color</label>
          <div style={styles.colorRow}>
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                style={{
                  ...styles.colorButton,
                  background: color,
                  border: form.color === color ? '3px solid var(--text)' : '3px solid transparent',
                }}
                onClick={() => setForm((prev) => ({ ...prev, color }))}
                aria-label="Select color"
              />
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Preview</label>
          <div style={{ ...styles.preview, background: form.color, flexDirection: isPhone ? 'column' : 'row', alignItems: isPhone ? 'flex-start' : styles.preview.alignItems }}>
            {coverPreview ? <img src={coverPreview} alt="cover preview" style={styles.previewImage} /> : <span style={styles.previewEmoji}>{form.emoji}</span>}
            <div>
              <div style={styles.previewTitle}>{form.title || 'Song Title'}</div>
              <div style={styles.previewSub}>{form.artist || 'Artist Name'}</div>
            </div>
          </div>
        </div>

        <div style={{ ...styles.actions, gridTemplateColumns: isPhone ? 'minmax(0, 1fr)' : styles.actions.gridTemplateColumns }}>
          <button style={{ ...styles.button, opacity: uploading ? 0.6 : 1 }} onClick={submit} disabled={uploading}>
            {uploading ? `Uploading... ${progress}%` : 'Upload Song'}
          </button>
          <button type="button" style={styles.secondaryButton} onClick={resetForm} disabled={uploading}>
            Reset Form
          </button>
        </div>
      </section>
    </div>
  )
}
