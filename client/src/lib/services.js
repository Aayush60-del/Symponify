import api from './api'


export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    if (data.token) localStorage.setItem('token', data.token)
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
    return data
  },

  register: async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password })
    if (data.token) localStorage.setItem('token', data.token)
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
    return data
  },

  getCurrentUser: async (token) => {
    const { data } = await api.get('/api/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return data.user
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('guestAccess')
  },

  guestAccess: () => {
    localStorage.setItem('guestAccess', 'true')
  },
}

// ============================================
// SONGS SERVICE
// ============================================
export const songsService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/api/songs', { params })
    return data
  },

  getAlbums: async () => {
    const { data } = await api.get('/api/songs/albums')
    return data
  },

  getLiked: async (token) => {
    const { data } = await api.get('/api/songs/liked', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return data
  },

  toggleLike: async (songId, token) => {
    const { data } = await api.post(`/api/songs/like/${songId}`, {}, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return data
  },

  search: async (query, limit = 50) => {
    const { data } = await api.get('/api/songs', {
      params: { search: query, limit },
    })
    return data
  },

  searchSongs: async (query, genre) => {
    if (genre && genre !== 'All') {
      const { data } = await api.get('/api/songs', {
        params: { genre, limit: 100 },
      })
      if (query) {
        const lowerQuery = query.toLowerCase()
        return data.filter(song =>
          song.title.toLowerCase().includes(lowerQuery) ||
          song.artist.toLowerCase().includes(lowerQuery) ||
          song.album.toLowerCase().includes(lowerQuery)
        )
      }
      return data
    }
    
    if (query) {
      return await songsService.search(query, 100)
    }
    
    const { data } = await api.get('/api/songs', {
      params: { limit: 100 },
    })
    return data
  },

  getByGenre: async (genre, limit = 50) => {
    const { data } = await api.get('/api/songs', {
      params: { genre, limit },
    })
    return data
  },

  getByAlbum: async (albumTitle) => {
    const { data } = await api.get('/api/songs', {
      params: { search: albumTitle },
    })
    return data.filter(song => song.album === albumTitle)
  },
}

// ============================================
// ADMIN SONGS SERVICE
// ============================================
export const adminSongsService = {
  add: async (payload, token) => {
    const { data } = await api.post('/api/songs/add', payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return data
  },

  upload: async (formData, token, config = {}) => {
    const { data } = await api.post('/api/songs/upload', formData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...config,
    })
    return data
  },

  update: async (id, payload, token) => {
    const { data } = await api.put(`/api/songs/${id}`, payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return data
  },

  delete: async (id, token) => {
    const { data } = await api.delete(`/api/songs/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return data
  },

  getAll: async (token) => {
    const { data } = await api.get('/api/songs/admin/all', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return data
  },
}

// ============================================
// ALBUMS SERVICE (ADMIN)
// ============================================
export const albumsService = {
  create: async (formData, token) => {
    const { data } = await api.post('/api/songs/albums', formData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  getAll: async () => {
    const { data } = await api.get('/api/songs/albums')
    return data
  },
}

// ============================================
// PLAYLISTS SERVICE
// ============================================
export const playlistsService = {
  getAll: async (token) => {
    const { data } = await api.get('/api/playlists', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return data
  },

  create: async (name, token) => {
    const { data } = await api.post('/api/playlists', { name }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return data
  },

  addSong: async (playlistId, songId, token) => {
    const { data } = await api.post(`/api/playlists/${playlistId}/songs`, { songId }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return data
  },

  removeSong: async (playlistId, songId, token) => {
    const { data } = await api.delete(`/api/playlists/${playlistId}/songs/${songId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return data
  },

  delete: async (playlistId, token) => {
    const { data } = await api.delete(`/api/playlists/${playlistId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return data
  },
}

// ============================================
// API INTERCEPTORS
// ============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('authchange'))
    }
    return Promise.reject(error)
  }
)
