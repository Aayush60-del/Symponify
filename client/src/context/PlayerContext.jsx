import { createContext, useContext, useEffect, useRef, useState } from 'react'
import api from '../lib/api'

const PlayerContext = createContext(null)
const GUEST_LIKED_SONGS_KEY = 'symponifyGuestLikedSongs'

const formatSeconds = (value) => {
  if (!Number.isFinite(value) || value < 0) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const parseDuration = (value) => {
  if (Number.isFinite(value) && value > 0) return value
  if (typeof value !== 'string') return 0

  const parts = value.split(':').map((part) => Number(part.trim()))
  if (!parts.length || parts.some((part) => !Number.isFinite(part) || part < 0)) return 0

  return parts.reduce((total, part) => total * 60 + part, 0)
}

const getAudioDuration = (audio) => {
  const nextDuration = audio?.duration || 0
  return Number.isFinite(nextDuration) && nextDuration > 0 ? nextDuration : 0
}

const resolveDuration = (metadataDuration, savedDuration) => {
  if (!metadataDuration) return savedDuration || 0
  if (!savedDuration) return metadataDuration

  const mismatch = Math.abs(metadataDuration - savedDuration)
  const tolerance = Math.max(8, savedDuration * 0.15)

  return mismatch > tolerance ? savedDuration : metadataDuration
}

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

const readGuestLikedSongs = () => {
  try {
    const stored = localStorage.getItem(GUEST_LIKED_SONGS_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeGuestLikedSongs = (songs) => {
  try {
    localStorage.setItem(GUEST_LIKED_SONGS_KEY, JSON.stringify(songs))
  } catch {
    // Storage can be unavailable in private browsing; keep state in memory.
  }
}

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [playbackError, setPlaybackError] = useState('')
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [shuffle, setShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off')
  const [likedSongs, setLikedSongs] = useState(() => (localStorage.getItem('guestAccess') === 'true' ? readGuestLikedSongs() : []))
  const [user, setUserState] = useState(readStoredUser)
  const [volume, setVolumeState] = useState(() => {
    const stored = Number(localStorage.getItem('playerVolume') || '70')
    return Number.isFinite(stored) ? Math.max(0, Math.min(100, stored)) : 70
  })
  const audioRef = useRef(typeof Audio !== 'undefined' ? new Audio() : null)
  const queueRef = useRef([])
  const currentIndexRef = useRef(-1)
  const currentSongRef = useRef(null)
  const shuffleRef = useRef(false)
  const repeatModeRef = useRef('off')

  const syncLikedSongs = async (nextUser = user) => {
    const token = localStorage.getItem('token')
    if (!token || !nextUser) {
      if (localStorage.getItem('guestAccess') === 'true') {
        const guestLikes = readGuestLikedSongs()
        setLikedSongs(guestLikes)
        return guestLikes
      }

      setLikedSongs([])
      return []
    }

    try {
      const { data } = await api.get('/api/songs/liked', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLikedSongs(data)
      return data
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUserState(null)
        window.dispatchEvent(new Event('authchange'))
      }
      setLikedSongs([])
      return []
    }
  }

  const getPlaybackIssue = (song) => {
    if (!song) return 'Audio playback is unavailable.'
    if (!song.audioUrl || song.audioReady === false) {
      return `The audio file for ${song.title} is missing or unavailable.`
    }
    return `Unable to play ${song.title}. The audio file may be missing or invalid.`
  }

  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  useEffect(() => {
    currentSongRef.current = currentSong
  }, [currentSong])

  useEffect(() => {
    shuffleRef.current = shuffle
  }, [shuffle])

  useEffect(() => {
    repeatModeRef.current = repeatMode
  }, [repeatMode])

  const getSongKey = (song) => song?._id || `${song?.title || ''}-${song?.artist || ''}`

  const playResolvedSong = async (song, nextQueue = [], nextIndex = -1) => {
    if (!song) return

    const audio = audioRef.current
    setPlaybackError('')
    setQueue(nextQueue)
    setCurrentIndex(nextIndex)
    setCurrentSong(song)
    setProgress(0)
    setDuration(parseDuration(song.duration))

    if (audio) {
      audio.pause()
      audio.currentTime = 0

      if (song.audioUrl && song.audioReady !== false) {
        audio.src = song.audioUrl
        audio.load()

        try {
          await audio.play()
          setPlaying(true)
          setPlaybackError('')
        } catch {
          setPlaying(false)
          setPlaybackError(getPlaybackIssue(song))
        }
      } else {
        audio.removeAttribute('src')
        setPlaying(false)
        setPlaybackError(getPlaybackIssue(song))
      }
    } else {
      setPlaying(true)
    }
  }

  useEffect(() => {
    const syncAuthState = () => {
      const nextUser = readStoredUser()
      setUserState(nextUser)

      const hasToken = Boolean(localStorage.getItem('token'))
      const isGuest = localStorage.getItem('guestAccess') === 'true'

      if (!hasToken && isGuest) {
        setLikedSongs(readGuestLikedSongs())
        return
      }

      if (!hasToken) {
        // Stop audio on logout
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
          audioRef.current.removeAttribute('src')
        }
        setPlaying(false)
        setCurrentSong(null)
        setQueue([])
        setCurrentIndex(-1)
        setLikedSongs([])
      }
    }

    window.addEventListener('storage', syncAuthState)
    window.addEventListener('authchange', syncAuthState)

    return () => {
      window.removeEventListener('storage', syncAuthState)
      window.removeEventListener('authchange', syncAuthState)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    audio.preload = 'metadata'
    audio.volume = Math.max(0, Math.min(1, volume / 100))

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0)
    }

    const handleLoadedMetadata = () => {
      const nextDuration = getAudioDuration(audio)
      if (nextDuration) {
        setDuration(resolveDuration(nextDuration, parseDuration(currentSongRef.current?.duration)))
      }
    }

    const handlePlay = () => {
      setPlaybackError('')
      setPlaying(true)
    }

    const handlePlaying = () => {
      setPlaybackError('')
      setPlaying(true)
    }

    const handlePause = () => {
      if (!audio.ended) {
        setPlaying(false)
      }
    }

    const handleError = () => {
      setPlaybackError(getPlaybackIssue(currentSongRef.current))
      setPlaying(false)
    }

    const handleEnded = async () => {
      const activeQueue = queueRef.current
      const activeIndex = currentIndexRef.current
      const activeRepeat = repeatModeRef.current
      const isShuffleOn = shuffleRef.current
      const activeSong = currentSongRef.current

      if (activeRepeat === 'one' && activeSong) {
        await playResolvedSong(activeSong, activeQueue, activeIndex)
        return
      }

      if (!activeQueue.length) {
        setPlaying(false)
        setProgress(0)
        return
      }

      let nextIndex = -1

      if (isShuffleOn && activeQueue.length > 1) {
        do {
          nextIndex = Math.floor(Math.random() * activeQueue.length)
        } while (nextIndex === activeIndex)
      } else if (activeIndex + 1 < activeQueue.length) {
        nextIndex = activeIndex + 1
      } else if (activeRepeat === 'all') {
        nextIndex = 0
      }

      if (nextIndex >= 0) {
        await playResolvedSong(activeQueue[nextIndex], activeQueue, nextIndex)
        return
      }

      setPlaying(false)
      setProgress(0)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('durationchange', handleLoadedMetadata)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('durationchange', handleLoadedMetadata)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume / 100))
    }

    localStorage.setItem('playerVolume', String(volume))
  }, [volume])

  useEffect(() => {
    syncLikedSongs()
  }, [user])

  const setUser = (nextUser) => {
    setUserState(nextUser)

    if (nextUser) {
      localStorage.setItem('user', JSON.stringify(nextUser))
    } else {
      localStorage.removeItem('user')
      setLikedSongs([])
    }

    window.dispatchEvent(new Event('authchange'))
  }

  const isLiked = (songId) => {
    if (!songId) return false
    return likedSongs.some((song) => song._id === songId)
  }

  const playSong = async (song, queueOverride) => {
    if (!song) return

    const audio = audioRef.current
    const nextQueue = Array.isArray(queueOverride) && queueOverride.length ? queueOverride : queueRef.current.length ? queueRef.current : [song]
    const resolvedIndex = Math.max(
      nextQueue.findIndex((item) => getSongKey(item) === getSongKey(song)),
      0
    )
    const sameSong =
      getSongKey(currentSong) === getSongKey(song)

    if (sameSong) {
      if (queueOverride?.length) {
        setQueue(nextQueue)
        setCurrentIndex(resolvedIndex)
      }

      if (!audio || !song.audioUrl || song.audioReady === false) {
        setPlaybackError(getPlaybackIssue(song))
        setPlaying(false)
        return
      }

      if (playing) {
        audio.pause()
        setPlaying(false)
      } else {
        try {
          await audio.play()
          setPlaying(true)
          setPlaybackError('')
        } catch {
          setPlaying(false)
          setPlaybackError(getPlaybackIssue(song))
        }
      }

      return
    }

    await playResolvedSong(song, nextQueue, resolvedIndex)
  }

  const togglePlay = async () => {
    if (!currentSong) return

    const audio = audioRef.current
    if (!audio || !currentSong.audioUrl || currentSong.audioReady === false) {
      setPlaybackError(getPlaybackIssue(currentSong))
      setPlaying(false)
      return
    }

    if (playing) {
      audio.pause()
      setPlaying(false)
      return
    }

    try {
      await audio.play()
      setPlaying(true)
      setPlaybackError('')
    } catch {
      setPlaying(false)
      setPlaybackError(getPlaybackIssue(currentSong))
    }
  }

  const seek = (nextTime) => {
    const audio = audioRef.current
    const audioDuration = getAudioDuration(audio)
    const seekDuration = audioDuration || duration || 0
    const safeTime = Math.max(0, Math.min(seekDuration, nextTime))

    if (audio && Number.isFinite(safeTime)) {
      audio.currentTime = safeTime
    }

    setProgress(safeTime)
  }

  const setVolume = (value) => {
    setVolumeState(Math.max(0, Math.min(100, value)))
  }

  const playNext = async () => {
    const activeQueue = queueRef.current
    if (!activeQueue.length) return

    let nextIndex = -1

    if (shuffleRef.current && activeQueue.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * activeQueue.length)
      } while (nextIndex === currentIndexRef.current)
    } else if (currentIndexRef.current + 1 < activeQueue.length) {
      nextIndex = currentIndexRef.current + 1
    } else if (repeatModeRef.current === 'all') {
      nextIndex = 0
    }

    if (nextIndex >= 0) {
      await playResolvedSong(activeQueue[nextIndex], activeQueue, nextIndex)
    }
  }

  const playPrevious = async () => {
    const activeQueue = queueRef.current
    const activeIndex = currentIndexRef.current
    const audio = audioRef.current

    if (audio && audio.currentTime > 3 && currentSongRef.current) {
      audio.currentTime = 0
      setProgress(0)
      return
    }

    if (!activeQueue.length) return

    let nextIndex = -1

    if (shuffleRef.current && activeQueue.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * activeQueue.length)
      } while (nextIndex === activeIndex)
    } else if (activeIndex > 0) {
      nextIndex = activeIndex - 1
    } else if (repeatModeRef.current === 'all') {
      nextIndex = activeQueue.length - 1
    }

    if (nextIndex >= 0) {
      await playResolvedSong(activeQueue[nextIndex], activeQueue, nextIndex)
    }
  }

  const toggleShuffle = () => {
    setShuffle((prev) => !prev)
  }

  const cycleRepeatMode = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all'
      if (prev === 'all') return 'one'
      return 'off'
    })
  }

  const toggleLike = async (song = currentSong) => {
    if (!song?._id) return

    const token = localStorage.getItem('token')
    if (!token) {
      if (localStorage.getItem('guestAccess') !== 'true') return false

      const exists = likedSongs.some((item) => item._id === song._id)
      const next = exists ? likedSongs.filter((item) => item._id !== song._id) : [...likedSongs, song]
      setLikedSongs(next)
      writeGuestLikedSongs(next)
      return !exists
    }

    try {
      const { data } = await api.post(
        `/api/songs/like/${song._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (data?.likedSongs) {
        await syncLikedSongs()
      } else {
        setLikedSongs((prev) =>
          data.liked ? [...prev.filter((item) => item._id !== song._id), song] : prev.filter((item) => item._id !== song._id)
        )
      }
      return Boolean(data?.liked)
    } catch {
      // Ignore like failures so the rest of the player stays usable.
      return false
    }
  }

  const progressPercent = duration > 0 ? Math.min((progress / duration) * 100, 100) : 0

  const value = {
    currentSong,
    currentTrack: currentSong,
    queue,
    currentIndex,
    playing,
    isPlaying: playing,
    shuffle,
    repeatMode,
    progress,
    progressPercent,
    duration,
    durationLabel: duration > 0 ? formatSeconds(duration) : currentSong?.duration || formatSeconds(duration),
    likedSongs,
    liked: isLiked(currentSong?._id),
    playbackError,
    user,
    volume,
    playSong,
    playTrack: playSong,
    setQueue,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    cycleRepeatMode,
    seek,
    setProgress: seek,
    setVolume,
    toggleLike,
    isLiked,
    setUser,
  }

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider')
  }

  return context
}
