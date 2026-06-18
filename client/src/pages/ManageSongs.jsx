import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import CoverArt from '../components/CoverArt'
import Loader from '../components/Loader'
import { usePlayer } from '../context/PlayerContext'
import { adminSongsService, albumsService, songsService } from '../lib/services'
import { useToast } from '../context/ToastContext'
import useViewport from '../hooks/useViewport'

const Icon = ({ name, size = 18, style: extraStyle }) => (
  <span className="material-symbols-rounded" style={{ fontSize: size, lineHeight: 1, ...extraStyle }}>{name}</span>
)

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
    background: 'linear-gradient(135deg, rgba(15,53,84,0.12), rgba(63,136,197,0.18))',
    border: '1px solid rgba(15,53,84,0.12)',
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
  msg: {
    padding: '13px 16px',
    borderRadius: '14px',
    fontSize: '13px',
    marginBottom: '18px',
    border: '1px solid',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '18px',
    alignItems: 'start',
  },
  albumsCard: {
    background: 'var(--card-bg)',
    backdropFilter: 'blur(10px)',
    border: '1px solid var(--line)',
    borderRadius: '28px',
    padding: '20px',
    boxShadow: 'var(--shadow)',
  },
  songsCard: {
    background: 'var(--card-bg)',
    backdropFilter: 'blur(10px)',
    border: '1px solid var(--line)',
    borderRadius: '28px',
    padding: '20px',
    boxShadow: 'var(--shadow)',
  },
  sectionTitle: {
    fontSize: 'clamp(1.125rem, 2.5vw, 1.125rem)',
    fontWeight: 800,
    marginBottom: '14px',
  },
  createAlbumBox: {
    padding: '16px',
    borderRadius: '22px',
    background: 'var(--surface-2)',
    border: '1px solid var(--line)',
    marginBottom: '16px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
  },
  field: {
    display: 'grid',
    gap: '6px',
  },
  label: {
    fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
    fontWeight: 700,
    color: 'var(--text-2)',
  },
  input: {
    width: '100%',
    padding: 'clamp(0.75rem, 1.5vw, 0.875rem)',
    borderRadius: '14px',
    background: 'var(--input-bg)',
    border: '1px solid var(--line)',
    outline: 'none',
    color: 'var(--text)',
  },
  full: {
    gridColumn: '1 / -1',
  },
  albumList: {
    display: 'grid',
    gap: '10px',
  },
  albumButton: {
    width: '100%',
    textAlign: 'left',
    padding: '14px 16px',
    borderRadius: '18px',
    background: 'var(--surface-2)',
    cursor: 'pointer',
    border: '1px solid transparent',
  },
  albumName: {
    fontSize: '14px',
    fontWeight: 800,
  },
  albumMeta: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginTop: '4px',
  },
  songsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '16px',
  },
  songsTitle: {
    fontSize: '20px',
    fontWeight: 800,
  },
  songsMeta: {
    fontSize: '12px',
    color: 'var(--text-3)',
  },
  songList: {
    display: 'grid',
    gap: '14px',
  },
  songCard: {
    border: '1px solid var(--line)',
    borderRadius: '22px',
    padding: '16px',
    background: 'var(--row-bg)',
  },
  songTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '14px',
  },
  songInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    minWidth: 0,
  },
  art: {
    width: '54px',
    height: '54px',
    borderRadius: '16px',
    display: 'grid',
    placeItems: 'center',
    color: '#fff',
    fontSize: '22px',
    overflow: 'hidden',
    flexShrink: 0,
  },
  artImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  },
  songName: {
    fontSize: '15px',
    fontWeight: 800,
  },
  songSub: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginTop: '4px',
  },
  controls: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  controlButton: {
    padding: '10px 14px',
    borderRadius: '999px',
    background: 'var(--surface-2)',
    cursor: 'pointer',
    fontWeight: 700,
    color: 'var(--text)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid var(--line)',
  },
  primaryButton: {
    background: 'var(--accent-gradient)',
    color: '#fff',
  },
  deleteButton: {
    background: 'rgba(190,18,60,0.12)',
    color: '#be123c',
    border: '1px solid rgba(190,18,60,0.12)',
  },
  empty: {
    padding: '24px',
    borderRadius: '22px',
    background: 'var(--card-bg)',
    border: '1px solid var(--line)',
    color: 'var(--text-2)',
    textAlign: 'center',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'var(--overlay)',
    zIndex: 40,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(460px, calc(100vw - 32px))',
    maxHeight: 'calc(100dvh - 40px)',
    overflowY: 'auto',
    background: 'var(--surface-glass-strong)',
    border: '1px solid var(--line)',
    borderRadius: '28px',
    boxShadow: 'var(--shadow)',
    padding: '22px',
    zIndex: 50,
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: 800,
    marginBottom: '8px',
  },
  modalCopy: {
    color: 'var(--text-2)',
    lineHeight: 1.6,
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
}

const emptyEdit = {
  title: '',
  artist: '',
  album: '',
  duration: '',
  genre: '',
  lyrics: '',
}

const emptyAlbumForm = {
  title: '',
  artist: '',
}

const albumCountLabel = (count) => `${count} ${count === 1 ? 'song' : 'songs'}`

export default function ManageSongs() {
  const { user } = usePlayer()
  const { error: showError, success: showSuccess } = useToast()
  const navigate = useNavigate()
  const { isMobile, isTabletOrBelow, isCompact, isWide } = useViewport()
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState('')
  const [editingSongId, setEditingSongId] = useState('')
  const [editForm, setEditForm] = useState(emptyEdit)
  const [createAlbumForm, setCreateAlbumForm] = useState(emptyAlbumForm)
  const [creatingAlbum, setCreatingAlbum] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [songPendingDelete, setSongPendingDelete] = useState(null)
  const [changingAlbumCover, setChangingAlbumCover] = useState(false)
  const [replacingSongId, setReplacingSongId] = useState('')
  const [albumNameDraft, setAlbumNameDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const token = localStorage.getItem('token')

  const loadData = async (preferredAlbum = '') => {
    try {
      setLoading(true)
      setLoadError('')
      const [nextSongs, nextAlbums] = await Promise.all([
        songsService.getAll({ limit: 500 }),
        albumsService.getAll(),
      ])

      setSongs(nextSongs)
      setAlbums(nextAlbums)
      setSelectedAlbum((prev) => {
        const available = nextAlbums.map((album) => album.title)
        if (preferredAlbum && available.includes(preferredAlbum)) return preferredAlbum
        if (prev && available.includes(prev)) return prev
        return available[0] || ''
      })
    } catch (err) {
      setSongs([])
      setAlbums([])
      setSelectedAlbum('')
      const errorMsg = 'We could not load the song manager right now.'
      setLoadError(errorMsg)
      showError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setAlbumNameDraft(selectedAlbum)
  }, [selectedAlbum])

  const visibleSongs = useMemo(() => {
    if (!selectedAlbum) return songs
    return songs.filter((song) => (song.album?.trim() || 'Singles') === selectedAlbum)
  }, [selectedAlbum, songs])

  const selectedAlbumData = useMemo(() => albums.find((album) => album.title === selectedAlbum) || null, [albums, selectedAlbum])
  const selectedAlbumCover = selectedAlbumData?.coverUrl || visibleSongs.find((song) => song.coverUrl)?.coverUrl || ''

  const startEdit = (song) => {
    setEditingSongId(song._id)
    setEditForm({
      title: song.title || '',
      artist: song.artist || '',
      album: song.album || '',
      duration: song.duration || '',
      genre: song.genre || '',
      lyrics: song.lyrics || '',
    })
    setMessage({ text: '', type: '' })
  }

  const cancelEdit = () => {
    setEditingSongId('')
    setEditForm(emptyEdit)
  }

  const saveSong = async (songId) => {
    try {
      const updatedSong = await adminSongsService.update(songId, editForm, token)
      await loadData(updatedSong?.album || selectedAlbum)
      const successMsg = 'Song updated successfully.'
      setMessage({ text: successMsg, type: 'success' })
      showSuccess(successMsg)
      setEditingSongId('')
      setEditForm(emptyEdit)
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Update failed'
      setMessage({ text: errorMsg, type: 'error' })
      showError(errorMsg)
    }
  }

  const deleteSong = async (songId) => {
    try {
      await adminSongsService.delete(songId, token)
      await loadData(selectedAlbum)
      const successMsg = 'Song deleted successfully.'
      setMessage({ text: successMsg, type: 'success' })
      showSuccess(successMsg)
      setSongPendingDelete(null)
      if (editingSongId === songId) {
        cancelEdit()
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Delete failed'
      setMessage({ text: errorMsg, type: 'error' })
      showError(errorMsg)
    }
  }

  const createAlbum = async () => {
    const title = createAlbumForm.title.trim()
    if (!title) {
      const msg = 'Album name is required.'
      setMessage({ text: msg, type: 'error' })
      showError(msg)
      return
    }

    try {
      setCreatingAlbum(true)
      const formData = new FormData()
      formData.append('title', title)
      formData.append('artist', createAlbumForm.artist.trim())

      const albumData = await albumsService.create(formData, token)

      setCreateAlbumForm(emptyAlbumForm)
      await loadData(albumData.title)
      const successMsg = 'Album created successfully. You can add songs and a cover later.'
      setMessage({ text: successMsg, type: 'success' })
      showSuccess(successMsg)
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Album creation failed'
      setMessage({ text: errorMsg, type: 'error' })
      showError(errorMsg)
    } finally {
      setCreatingAlbum(false)
    }
  }

  const changeAlbumCover = async (event) => {
    const file = event.target.files?.[0]
    if (!file || !selectedAlbum) return

    try {
      setChangingAlbumCover(true)
      const formData = new FormData()
      formData.append('title', selectedAlbum)
      formData.append('cover', file)

      await api.post(`/api/songs/albums/${encodeURIComponent(selectedAlbum)}/cover`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      await loadData(selectedAlbum)
      setMessage({ text: 'Album cover updated successfully.', type: 'success' })
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Album cover update failed', type: 'error' })
    } finally {
      setChangingAlbumCover(false)
      event.target.value = ''
    }
  }

  const renameAlbum = async () => {
    const nextAlbum = albumNameDraft.trim()
    if (!selectedAlbum || !nextAlbum || nextAlbum === selectedAlbum) return

    try {
      const { data } = await api.put(
        `/api/songs/albums/${encodeURIComponent(selectedAlbum)}`,
        { album: nextAlbum },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      await loadData(data.album)
      setMessage({ text: 'Album renamed successfully.', type: 'success' })
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Album rename failed', type: 'error' })
    }
  }

  const replaceSongMedia = async (songId, songTitle, event, field) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.size) {
      setMessage({ text: 'The selected file is empty. Choose a valid media file.', type: 'error' })
      event.target.value = ''
      return
    }

    try {
      setReplacingSongId(songId)
      const formData = new FormData()
      formData.append('title', songTitle)
      formData.append(field, file)

      await api.put(`/api/songs/${songId}/media`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      await loadData(selectedAlbum)
      setMessage({ text: field === 'audio' ? 'Song audio replaced successfully.' : 'Song cover replaced successfully.', type: 'success' })
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Media update failed', type: 'error' })
    } finally {
      setReplacingSongId('')
      event.target.value = ''
    }
  }

  if (!user?.isAdmin) {
    return (
      <div style={styles.page} className="scrollbar-hidden">
        <section style={styles.hero}>
          <div style={styles.eyebrow}>Admin Tools</div>
          <h1 style={styles.title}>Admin access only</h1>
          <p style={styles.copy}>The Manage Songs page is available only to admins.</p>
        </section>
      </div>
    )
  }

  return (
    <div style={{ ...styles.page, padding: isMobile ? '16px' : isTabletOrBelow ? '20px' : styles.page.padding, width: '100%', maxWidth: isWide ? '1500px' : '100%', marginInline: 'auto' }} className="scrollbar-hidden">
      <section style={{ ...styles.hero, padding: isMobile ? '20px' : styles.hero.padding }}>
        <div style={styles.eyebrow}>Admin Tools</div>
        <h1 style={{ ...styles.title, fontSize: isMobile ? '28px' : styles.title.fontSize }}>Manage Songs</h1>
        <p style={styles.copy}>Create albums here, update covers later, and use the shortcut to add songs directly to the selected album.</p>
      </section>

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

      <div style={{ ...styles.layout, gridTemplateColumns: isCompact ? 'minmax(0, 1fr)' : isWide ? '360px minmax(0, 1fr)' : styles.layout.gridTemplateColumns }}>
        <section style={styles.albumsCard}>
          <h2 style={styles.sectionTitle}>Albums</h2>

          <div style={styles.createAlbumBox}>
            <div style={{ ...styles.sectionTitle, fontSize: '16px', marginBottom: '12px' }}>Create New Album</div>
            <div style={{ ...styles.formGrid, gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : styles.formGrid.gridTemplateColumns }}>
              <div style={{ ...styles.field, ...styles.full }}>
                <label style={styles.label}>Album Name</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Weekend Drafts"
                  value={createAlbumForm.title}
                  onChange={(event) => setCreateAlbumForm((prev) => ({ ...prev, title: event.target.value }))}
                />
              </div>
              <div style={{ ...styles.field, ...styles.full }}>
                <label style={styles.label}>Album Artist / Owner</label>
                <input
                  style={styles.input}
                  placeholder="Optional"
                  value={createAlbumForm.artist}
                  onChange={(event) => setCreateAlbumForm((prev) => ({ ...prev, artist: event.target.value }))}
                />
              </div>
            </div>
            <div style={{ ...styles.controls, marginTop: '12px' }}>
              <button type="button" style={{ ...styles.controlButton, ...styles.primaryButton }} onClick={createAlbum} disabled={creatingAlbum}>
                <Icon name="add_circle" />
                {creatingAlbum ? 'Creating...' : 'Create Album'}
              </button>
            </div>
          </div>

          {albums.length ? (
            <div style={styles.albumList}>
              {albums.map((album) => (
                <button
                  key={album.title}
                  type="button"
                  style={{
                    ...styles.albumButton,
                    background: selectedAlbum === album.title ? 'var(--active-bg)' : 'var(--surface-2)',
                    color: selectedAlbum === album.title ? 'var(--active-text)' : 'var(--text)',
                    borderColor: selectedAlbum === album.title ? 'rgba(255, 122, 0, 0.26)' : 'transparent',
                  }}
                  onClick={() => setSelectedAlbum(album.title)}
                >
                  <div style={styles.albumName}>{album.title}</div>
                  <div style={{ ...styles.albumMeta, color: selectedAlbum === album.title ? 'rgba(255,255,255,0.72)' : styles.albumMeta.color }}>
                    {albumCountLabel(album.songCount || 0)}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div style={styles.empty}>No albums are available yet.</div>
          )}
        </section>

        <section style={styles.songsCard}>
          <div style={{ ...styles.songsHeader, flexWrap: isMobile ? 'wrap' : 'nowrap', alignItems: isMobile ? 'flex-start' : 'center' }}>
            <div>
              <div style={styles.songsTitle}>{selectedAlbum || 'Select an album'}</div>
              <div style={styles.songsMeta}>
                {selectedAlbumData ? `${albumCountLabel(selectedAlbumData.songCount || 0)} available for management` : 'Select an album or create a new one to get started.'}
              </div>
            </div>
            {selectedAlbum ? (
              <div style={styles.controls}>
                <button type="button" style={{ ...styles.controlButton, ...styles.primaryButton }} onClick={() => navigate(`/home/add-song?album=${encodeURIComponent(selectedAlbum)}`)}>
                  <Icon name="add_circle" />
                  Add Song
                </button>
                <label style={styles.controlButton}>
                  <Icon name="edit" />
                  {changingAlbumCover ? 'Updating...' : 'Change Cover'}
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={changeAlbumCover} disabled={changingAlbumCover} />
                </label>
              </div>
            ) : null}
          </div>

          {selectedAlbum && !loading && !loadError ? (
            <>
              <div style={{ ...styles.songCard, marginBottom: '16px' }}>
                <div style={{ ...styles.songInfo, alignItems: 'center' }}>
                  <CoverArt
                    src={selectedAlbumCover}
                    alt={`${selectedAlbum} cover`}
                    containerStyle={{ ...styles.art, width: '72px', height: '72px', borderRadius: '18px', background: selectedAlbumCover ? 'var(--surface-2)' : selectedAlbumData?.color || 'linear-gradient(135deg, #333, #666)', fontSize: '28px' }}
                    imgStyle={styles.artImage}
                    fallback={selectedAlbumData?.emoji || <Icon name="music_note" size={22} />}
                  />
                  <div>
                    <div style={styles.songName}>{selectedAlbum}</div>
                    <div style={styles.songSub}>
                      {selectedAlbumCover ? 'Current album cover' : 'No cover has been added yet. Use Change Cover to upload one later.'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ ...styles.songCard, marginBottom: '16px' }}>
                <div style={{ ...styles.formGrid, gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : styles.formGrid.gridTemplateColumns }}>
                  <div style={{ ...styles.field, ...styles.full }}>
                    <label style={styles.label}>Album Name</label>
                    <input style={styles.input} value={albumNameDraft} onChange={(event) => setAlbumNameDraft(event.target.value)} />
                  </div>
                  <div style={styles.controls}>
                    <button type="button" style={styles.controlButton} onClick={renameAlbum} disabled={!albumNameDraft.trim() || albumNameDraft.trim() === selectedAlbum}>
                      <Icon name="save" />
                      Rename Album
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {loading ? (
            <Loader />
          ) : loadError ? (
            <div style={styles.empty}>{loadError}</div>
          ) : selectedAlbum ? (
            visibleSongs.length ? (
              <div style={styles.songList}>
                {visibleSongs.map((song) => {
                  const isEditing = editingSongId === song._id
                  return (
                    <article key={song._id} style={styles.songCard}>
                      <div style={{ ...styles.songTop, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center' }}>
                        <div style={styles.songInfo}>
                          <CoverArt
                            src={song.coverUrl}
                            alt={`${song.title} cover`}
                            containerStyle={{ ...styles.art, background: song.coverUrl ? 'var(--surface-2)' : song.color || 'linear-gradient(135deg, #333, #666)' }}
                            imgStyle={styles.artImage}
                            fallback={song.emoji || <Icon name="music_note" size={22} />}
                          />
                          <div style={{ minWidth: 0 }}>
                            <div style={styles.songName}>{song.title}</div>
                            <div style={styles.songSub}>
                              {song.artist} | {song.duration || '0:00'} | {song.genre || 'No genre'}
                            </div>
                            {!song.audioReady ? (
                              <div style={{ ...styles.songSub, color: '#c54d2b' }}>
                                <Icon name="error" size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                Audio file is missing or unavailable
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div style={styles.controls}>
                          {isEditing ? (
                            <>
                              <button type="button" style={styles.controlButton} onClick={() => saveSong(song._id)}>
                                <Icon name="save" />
                                Save
                              </button>
                              <button type="button" style={styles.controlButton} onClick={cancelEdit}>
                                <Icon name="close" />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button type="button" style={styles.controlButton} onClick={() => startEdit(song)}>
                              <Icon name="edit" />
                              Update
                            </button>
                          )}
                          <label style={styles.controlButton}>
                            <Icon name="upload" />
                            {replacingSongId === song._id ? 'Uploading...' : 'Replace Audio'}
                            <input
                              type="file"
                              accept=".mp3,.wav,.ogg,.m4a"
                              style={{ display: 'none' }}
                              onChange={(event) => replaceSongMedia(song._id, song.title, event, 'audio')}
                              disabled={replacingSongId === song._id}
                            />
                          </label>
                          <label style={styles.controlButton}>
                            <Icon name="edit" />
                            {replacingSongId === song._id ? 'Uploading...' : 'Replace Cover'}
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              style={{ display: 'none' }}
                              onChange={(event) => replaceSongMedia(song._id, song.title, event, 'cover')}
                              disabled={replacingSongId === song._id}
                            />
                          </label>
                          <button type="button" style={{ ...styles.controlButton, ...styles.deleteButton }} onClick={() => setSongPendingDelete(song)}>
                            <Icon name="delete" />
                            Delete
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div style={{ ...styles.formGrid, gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : styles.formGrid.gridTemplateColumns }}>
                          <div style={styles.field}>
                            <label style={styles.label}>Title</label>
                            <input style={styles.input} value={editForm.title} onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))} />
                          </div>
                          <div style={styles.field}>
                            <label style={styles.label}>Artist</label>
                            <input style={styles.input} value={editForm.artist} onChange={(event) => setEditForm((prev) => ({ ...prev, artist: event.target.value }))} />
                          </div>
                          <div style={styles.field}>
                            <label style={styles.label}>Album</label>
                            <input style={styles.input} value={editForm.album} onChange={(event) => setEditForm((prev) => ({ ...prev, album: event.target.value }))} />
                          </div>
                          <div style={styles.field}>
                            <label style={styles.label}>Duration</label>
                            <input style={styles.input} value={editForm.duration} onChange={(event) => setEditForm((prev) => ({ ...prev, duration: event.target.value }))} />
                          </div>
                          <div style={{ ...styles.field, ...styles.full }}>
                            <label style={styles.label}>Genre</label>
                            <input style={styles.input} value={editForm.genre} onChange={(event) => setEditForm((prev) => ({ ...prev, genre: event.target.value }))} />
                          </div>
                          <div style={{ ...styles.field, ...styles.full }}>
                            <label style={styles.label}>Lyrics</label>
                            <textarea
                              style={{
                                ...styles.input,
                                minHeight: '150px',
                                resize: 'vertical',
                                lineHeight: 1.6,
                              }}
                              value={editForm.lyrics || ''}
                              placeholder={`Optional lyrics:\n[00:00] First line\n[00:08] Second line`}
                              onChange={(event) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  lyrics: event.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            ) : (
              <div style={styles.empty}>This album does not have any songs yet. Use `Add Song` to add tracks and `Change Cover` to upload artwork later.</div>
            )
          ) : (
            <div style={styles.empty}>Select an album from the left or create a new one. After that, you can rename it, update the cover, and manage songs here.</div>
          )}
        </section>
      </div>

      {songPendingDelete ? (
        <>
          <button type="button" aria-label="Close delete confirmation" style={styles.overlay} onClick={() => setSongPendingDelete(null)} />
          <div style={styles.modal}>
            <div style={styles.modalTitle}>Delete Song?</div>
            <p style={styles.modalCopy}>
              Are you sure you want to permanently remove `{songPendingDelete.title}`? This action cannot be undone.
            </p>
            <div style={styles.modalActions}>
              <button type="button" style={styles.controlButton} onClick={() => setSongPendingDelete(null)}>
                Cancel
              </button>
              <button type="button" style={{ ...styles.controlButton, ...styles.deleteButton }} onClick={() => deleteSong(songPendingDelete._id)}>
                <Icon name="delete" />
                Delete
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
