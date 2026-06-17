import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { authService } from '../lib/services'
import useViewport from '../hooks/useViewport'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 'clamp(0.75rem, 2.5vw, 1.5rem)',
    background: '#f5f4f0',
    color: '#1a1a18',
  },
  wrap: {
    width: 'min(1080px, 100%)',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
    gap: 'clamp(0.9rem, 2vw, 1.1rem)',
    alignItems: 'stretch',
  },
  hero: {
    borderRadius: 'clamp(1.5rem, 3vw, 2rem)',
    padding: 'clamp(1.25rem, 3vw, 2rem)',
    background: 'linear-gradient(160deg, #1a102f, #492c58 52%, #ff5c35)',
    color: '#fff',
    minHeight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 20px 70px rgba(30, 14, 40, 0.22)',
  },
  heroTitle: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(1.95rem, 4vw, 3.375rem)',
    lineHeight: 0.96,
    maxWidth: '8ch',
  },
  heroCopy: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: 'clamp(0.82rem, 1.2vw, 0.95rem)',
    lineHeight: 1.6,
    maxWidth: '36ch',
    marginTop: '18px',
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '14px',
    marginTop: '24px',
  },
  metricCard: {
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.12)',
    padding: '16px',
    backdropFilter: 'blur(8px)',
  },
  metricNum: {
    fontFamily: 'var(--mono)',
    fontSize: 'clamp(1.25rem, 2.5vw, 1.375rem)',
    marginBottom: '8px',
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
  },
  card: {
    borderRadius: 'clamp(1.5rem, 3vw, 2rem)',
    background: 'rgba(255,255,255,0.9)',
    boxShadow: 'var(--shadow)',
    padding: 'clamp(1.25rem, 3vw, 2.1rem)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    border: '1px solid var(--line)',
    color: '#1a1a18',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)',
    marginBottom: '10px',
    color: '#1a1a18',
  },
  dot: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    background: 'var(--accent)',
  },
  subtitle: {
    color: '#6e6c66',
    fontSize: 'clamp(0.82rem, 1.2vw, 0.95rem)',
    marginBottom: '24px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    padding: '6px',
    background: '#f7f6f2',
    borderRadius: '999px',
    marginBottom: '20px',
  },
  tab: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '999px',
    background: 'transparent',
    border: 'none',
    appearance: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    color: '#1a1a18',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '42px',
  },
  field: {
    marginBottom: '14px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
    color: '#6e6c66',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    background: '#f7f6f2',
    border: '1px solid transparent',
    borderRadius: '16px',
    outline: 'none',
    color: '#1a1a18',
  },
  error: {
    color: '#c54d2b',
    fontSize: '13px',
    marginBottom: '12px',
  },
  button: {
    width: '100%',
    padding: '13px 18px',
    borderRadius: '999px',
    background: 'var(--text)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '8px',
  },
  secondaryButton: {
    width: '100%',
    padding: '12px 18px',
    borderRadius: '999px',
    background: '#fff6ef',
    color: '#a64724',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '12px',
    border: '1px solid rgba(166, 71, 36, 0.14)',
  },
  hint: {
    fontSize: '12px',
    color: '#8a877f',
    marginTop: '10px',
    textAlign: 'center',
  },
}

export default function Login() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [adminSubmitting, setAdminSubmitting] = useState(false)
  const navigate = useNavigate()
  const { error: showError, success: showSuccess } = useToast()
  const { isMobile, isTabletOrBelow, isWide } = useViewport()

  const handleAuthSuccess = (data, nextPath = '/') => {
    localStorage.removeItem('guestAccess')
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    window.dispatchEvent(new Event('authchange'))
    navigate(nextPath, { replace: true })
  }

  const skipToApp = () => {
    setError('')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.setItem('guestAccess', 'true')
    window.dispatchEvent(new Event('authchange'))
    navigate('/', { replace: true })
  }

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const submit = async () => {
    setError('')

    // Validation
    if (!form.email || !form.password) {
      const errorMsg = 'Please fill in all required fields'
      setError(errorMsg)
      showError(errorMsg)
      return
    }

    if (tab === 'signup' && !form.name) {
      const errorMsg = 'Please enter your name'
      setError(errorMsg)
      showError(errorMsg)
      return
    }

    try {
      setSubmitting(true)
      let data

      if (tab === 'login') {
        data = await authService.login(form.email, form.password)
      } else {
        data = await authService.register(form.name, form.email, form.password)
      }

      showSuccess(tab === 'login' ? 'Logged in successfully!' : 'Account created successfully!')
      handleAuthSuccess(data)
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Something went wrong'
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await submit()
  }

  const openAdminAccess = async () => {
    setError('')

    if (!form.email || !form.password) {
      const errorMsg = 'Please enter email and password for admin access'
      setError(errorMsg)
      showError(errorMsg)
      return
    }

    try {
      setAdminSubmitting(true)
      // Admin login is same as regular login, just with admin credentials
      const data = await authService.login(form.email, form.password)
      
      if (!data.user?.isAdmin) {
        throw new Error('Invalid admin credentials')
      }
      
      showSuccess('Admin access granted!')
      handleAuthSuccess(data, '/add-song')
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Invalid admin credentials'
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setAdminSubmitting(false)
    }
  }

  return (
    <div
      style={{
        ...styles.page,
        padding: isMobile ? '16px' : '24px',
        placeItems: 'center',
      }}
    >
      <div
        style={{
          ...styles.wrap,
          width: isMobile ? '100%' : styles.wrap.width,
          maxWidth: isMobile ? '480px' : styles.wrap.width,
          gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
          gap: isMobile ? '12px' : isWide ? '22px' : styles.wrap.gap,
          alignItems: 'stretch',
        }}
      >
        <section style={{ ...styles.hero, minHeight: isMobile ? 'auto' : '520px', padding: isMobile ? '18px' : styles.hero.padding, borderRadius: isMobile ? '24px' : styles.hero.borderRadius }}>
          <div>
            <div style={styles.logo}>
              <span style={styles.dot} />
              Symponify
            </div>
            <h1 style={{ ...styles.heroTitle, fontSize: isMobile ? '30px' : styles.heroTitle.fontSize, maxWidth: isMobile ? '9ch' : styles.heroTitle.maxWidth }}>A music room with calm energy.</h1>
            <p style={{ ...styles.heroCopy, fontSize: isMobile ? '0.88rem' : styles.heroCopy.fontSize, marginTop: isMobile ? '14px' : styles.heroCopy.marginTop }}>
              Keep your favorite records, discover textured playlists, and move through your library with a warm minimal interface.
            </p>
          </div>
          <div style={{ ...styles.metrics, gridTemplateColumns: isMobile ? 'repeat(3, minmax(0, 1fr))' : styles.metrics.gridTemplateColumns, gap: isMobile ? '10px' : styles.metrics.gap, marginTop: isMobile ? '20px' : styles.metrics.marginTop }}>
            <div style={styles.metricCard}>
              <div style={{ ...styles.metricNum, fontSize: isMobile ? '1.05rem' : styles.metricNum.fontSize }}>24/7</div>
              <div style={{ ...styles.metricLabel, fontSize: isMobile ? '0.66rem' : styles.metricLabel.fontSize }}>always-on personal listening</div>
            </div>
            <div style={styles.metricCard}>
              <div style={{ ...styles.metricNum, fontSize: isMobile ? '1.05rem' : styles.metricNum.fontSize }}>120+</div>
              <div style={{ ...styles.metricLabel, fontSize: isMobile ? '0.66rem' : styles.metricLabel.fontSize }}>handpicked moods and mixes</div>
            </div>
            <div style={styles.metricCard}>
              <div style={{ ...styles.metricNum, fontSize: isMobile ? '1.05rem' : styles.metricNum.fontSize }}>HD</div>
              <div style={{ ...styles.metricLabel, fontSize: isMobile ? '0.66rem' : styles.metricLabel.fontSize }}>clean interface, clear focus</div>
            </div>
          </div>
        </section>

        <section style={{ ...styles.card, padding: isMobile ? '18px' : styles.card.padding, borderRadius: isMobile ? '24px' : styles.card.borderRadius }}>
          <div style={styles.logo}>
            <span style={styles.dot} />
            Symponify
          </div>
          <p style={{ ...styles.subtitle, marginBottom: isMobile ? '18px' : styles.subtitle.marginBottom }}>Your music, beautifully organized.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ ...styles.tabs, marginBottom: isMobile ? '16px' : styles.tabs.marginBottom, gap: isMobile ? '8px' : styles.tabs.gap }}>
              <button
                type="button"
                style={{
                  ...styles.tab,
                  background: tab === 'login' ? '#1a1a18' : 'transparent',
                  color: tab === 'login' ? '#fff' : '#1a1a18',
                  minHeight: isMobile ? '38px' : styles.tab.minHeight,
                  fontSize: isMobile ? '0.92rem' : 'inherit',
                }}
                onClick={() => setTab('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                style={{
                  ...styles.tab,
                  background: tab === 'signup' ? '#1a1a18' : 'transparent',
                  color: tab === 'signup' ? '#fff' : '#1a1a18',
                  minHeight: isMobile ? '38px' : styles.tab.minHeight,
                  fontSize: isMobile ? '0.92rem' : 'inherit',
                }}
                onClick={() => setTab('signup')}
              >
                Sign Up
              </button>
            </div>

            {tab === 'signup' ? (
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input style={{ ...styles.input, padding: isMobile ? '11px 14px' : styles.input.padding }} name="name" placeholder="Your name" value={form.name} onChange={handleChange} autoComplete="name" />
              </div>
            ) : null}

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={{ ...styles.input, padding: isMobile ? '11px 14px' : styles.input.padding }}
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={{ ...styles.input, padding: isMobile ? '11px 14px' : styles.input.padding }}
                name="password"
                type="password"
                placeholder="........"
                value={form.password}
                onChange={handleChange}
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error ? <p style={styles.error}>{error}</p> : null}

            <button type="submit" style={{ ...styles.button, padding: isMobile ? '12px 16px' : styles.button.padding }} disabled={submitting || adminSubmitting}>
              {submitting ? 'Please wait...' : tab === 'login' ? 'Sign In ->' : 'Create Account ->'}
            </button>
            <button type="button" style={{ ...styles.secondaryButton, padding: isMobile ? '11px 16px' : styles.secondaryButton.padding }} onClick={skipToApp} disabled={submitting || adminSubmitting}>
              Skip and Explore
            </button>
            <button type="button" style={{ ...styles.secondaryButton, padding: isMobile ? '11px 16px' : styles.secondaryButton.padding }} onClick={openAdminAccess} disabled={submitting || adminSubmitting}>
              {adminSubmitting ? 'Checking access...' : 'Admin Access'}
            </button>
          </form>
          <p style={styles.hint}>Skip to browse as a guest, or use approved admin credentials for upload controls.</p>
        </section>
      </div>
    </div>
  )
}
