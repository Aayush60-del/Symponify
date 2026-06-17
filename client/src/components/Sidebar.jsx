import { NavLink, useNavigate } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'
import useViewport from '../hooks/useViewport'

const Icon = ({ name, size = 20, style: extraStyle }) => (
  <span className="material-symbols-rounded" style={{ fontSize: size, lineHeight: 1, ...extraStyle }}>{name}</span>
)

const styles = {
  sidebar: {
    background: 'var(--sidebar-bg)',
    backdropFilter: 'blur(12px)',
    border: '1px solid var(--line)',
    borderRadius: '32px',
    padding: '28px 22px',
    boxShadow: 'var(--shadow)',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'var(--serif)',
    fontSize: '28px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'var(--accent-gradient)',
    boxShadow: '0 0 18px rgba(255, 122, 0, 0.35)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    paddingInline: '10px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '18px',
    color: 'var(--text-2)',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  cta: {
    marginTop: 'auto',
    padding: '18px',
    borderRadius: '24px',
    background: 'linear-gradient(160deg, #23232D, #3a2537 58%, #FF5500)',
    color: '#fff',
  },
  ctaTitle: {
    fontSize: '20px',
    fontFamily: 'var(--serif)',
    marginBottom: '8px',
  },
  ctaText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '13px',
    lineHeight: 1.5,
    marginBottom: '14px',
  },
  ctaButton: {
    padding: '12px 16px',
    borderRadius: '999px',
    background: 'var(--active-text)',
    color: '#121218',
    fontWeight: 700,
    cursor: 'pointer',
  },
  mobileActionButton: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '16px',
    background: 'var(--surface-elevated)',
    color: 'var(--text)',
    border: '1px solid var(--line-strong)',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  closeButton: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'var(--surface-2)',
    color: 'var(--text)',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
}

export default function Sidebar({ isCompact = false, isOpen = false, onClose }) {
  const navigate = useNavigate()
  const { user } = usePlayer()
  const { isMobile, isTabletOrBelow, isWide } = useViewport()
  const isGuest = localStorage.getItem('guestAccess') === 'true'

  const links = [
    { to: '/home', label: 'Home', iconName: 'home', end: true },
    { to: '/home/search', label: 'Search', iconName: 'search' },
    { to: '/home/library', label: 'Library', iconName: 'library_music' },
    { to: '/home/liked', label: 'Liked Songs', iconName: 'favorite' },
  ]

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('guestAccess')
    window.dispatchEvent(new Event('authchange'))
    // Redirect to landing page instead of login
    window.location.href = '/'
    onClose?.()
  }

  const sidebarStyle = {
    ...styles.sidebar,
    gridRow: isCompact ? 'auto' : '1 / span 2',
    position: isCompact ? 'fixed' : 'relative',
    top: isCompact ? '12px' : 'auto',
    left: isCompact ? '12px' : 'auto',
    bottom: isCompact ? '12px' : 'auto',
    maxWidth: isCompact ? '100%' : 'none',
    transform: isCompact ? `translateX(${isOpen ? '0' : '-120%'})` : 'none',
    transition: 'transform 0.25s ease',
    zIndex: isCompact ? 40 : 'auto',
    overflowY: 'auto',
    padding: isTabletOrBelow ? '20px 18px' : styles.sidebar.padding,
    borderRadius: isTabletOrBelow ? '24px' : styles.sidebar.borderRadius,
    height: isCompact ? 'calc(100dvh - 24px)' : '100%',
    maxHeight: isCompact ? 'calc(100dvh - 24px)' : '100%',
    width: isCompact ? 'min(320px, calc(100vw - 24px))' : isWide ? '320px' : 'auto',
  }

  return (
    <aside style={sidebarStyle} aria-hidden={isCompact ? !isOpen : false}>
      <div style={styles.topRow}>
        <div style={styles.brand}>
          <span style={styles.dot} />
          Symponify
        </div>
        {isCompact ? (
          <button type="button" style={styles.closeButton} aria-label="Close menu" onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        ) : null}
      </div>

      {isCompact && !isGuest ? (
        <button type="button" style={styles.mobileActionButton} onClick={logout}>
          <Icon name="logout" size={16} />
          Logout
        </button>
      ) : null}

      <div style={styles.section}>
        <span style={styles.sectionLabel}>Browse</span>
        {links.map(({ to, label, iconName, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => {
              if (isCompact) onClose?.()
            }}
            style={({ isActive }) => ({
              ...styles.link,
              background: isActive ? 'var(--active-bg)' : 'transparent',
              color: isActive ? 'var(--active-text)' : 'var(--text-2)',
              border: isActive ? '1px solid rgba(255, 122, 0, 0.26)' : '1px solid transparent',
              boxShadow: isActive ? '0 12px 28px rgba(255, 85, 0, 0.16)' : 'none',
            })}
          >
            <Icon name={iconName} size={18} />
            {label}
          </NavLink>
        ))}
        {user?.isAdmin ? (
          <>
            <NavLink
              to="/home/add-song"
              onClick={() => {
                if (isCompact) onClose?.()
              }}
              style={({ isActive }) => ({
                ...styles.link,
                marginTop: '4px',
                background: isActive ? 'var(--active-bg)' : 'var(--surface-elevated)',
                color: 'var(--text)',
                border: '1px solid var(--line-strong)',
                boxShadow: isActive ? '0 12px 28px rgba(255, 85, 0, 0.16)' : 'none',
                borderRadius: '999px',
              })}
            >
              <Icon name="add_circle" size={18} />
              Add Song
            </NavLink>
            <NavLink
              to="/home/manage-songs"
              onClick={() => {
                if (isCompact) onClose?.()
              }}
              style={({ isActive }) => ({
                ...styles.link,
                background: isActive ? 'var(--active-bg)' : 'var(--surface-elevated)',
                color: 'var(--text)',
                border: '1px solid var(--line-strong)',
                boxShadow: isActive ? '0 12px 28px rgba(255, 85, 0, 0.16)' : 'none',
                borderRadius: '999px',
              })}
            >
              <Icon name="edit_note" size={18} />
              Manage Songs
            </NavLink>
          </>
        ) : null}
      </div>

      {!isCompact || isGuest ? (
        <div style={styles.cta}>
          <div style={styles.ctaTitle}>Curated daily</div>
          <p style={styles.ctaText}>A bright mix of synth, soul, and intimate acoustic sessions picked for you.</p>
          <button style={{ ...styles.ctaButton, width: isMobile ? '100%' : 'auto' }} onClick={logout}>
            <Icon name="logout" size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            {isGuest ? 'Exit Guest Mode' : 'Logout'}
          </button>
        </div>
      ) : null}
    </aside>
  )
}
