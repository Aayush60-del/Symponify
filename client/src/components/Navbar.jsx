import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useViewport from '../hooks/useViewport'
import { useTheme } from '../context/ThemeContext'

const notifications = [
  {
    title: 'Upload complete',
    copy: 'Your latest song is ready to play from the library.',
    time: 'Just now',
  },
  {
    title: 'New mix available',
    copy: 'Fresh evening recommendations have been added for you.',
    time: '12 min ago',
  },
  {
    title: 'Liked songs updated',
    copy: 'Your favorites are synced and ready across the player.',
    time: 'Today',
  },
]

const Icon = ({ name, size = 20, style: extraStyle }) => (
  <span className="material-symbols-rounded" style={{ fontSize: size, lineHeight: 1, ...extraStyle }}>{name}</span>
)

const styles = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    position: 'relative',
  },
  titleWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  eyebrow: {
    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-3)',
    fontWeight: 700,
  },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(1.25rem, 3.5vw, 1.875rem)',
    lineHeight: 1,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
  },
  search: {
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '999px',
    background: 'var(--input-bg)',
    border: '1px solid var(--line)',
    boxShadow: 'var(--shadow)',
    color: 'var(--text-2)',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'var(--text)',
  },
  iconBtn: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    background: 'var(--surface-glass-strong)',
    border: '1px solid var(--line)',
    display: 'grid',
    placeItems: 'center',
    boxShadow: 'var(--shadow)',
    cursor: 'pointer',
    color: 'var(--text)',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: '10px',
    right: '11px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent)',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'var(--overlay)',
    zIndex: 20,
  },
  panel: {
    position: 'fixed',
    top: '18px',
    right: '18px',
    width: 'min(360px, calc(100vw - 24px))',
    maxHeight: 'calc(100vh - 36px)',
    background: 'var(--surface-glass-strong)',
    border: '1px solid var(--line)',
    borderRadius: '28px',
    boxShadow: 'var(--shadow)',
    backdropFilter: 'blur(16px)',
    zIndex: 30,
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 18px 14px',
    borderBottom: '1px solid var(--line)',
  },
  panelTitle: {
    fontSize: '18px',
    fontWeight: 800,
  },
  closeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: 'var(--surface-2)',
    cursor: 'pointer',
    color: 'var(--text-2)',
  },
  panelBody: {
    padding: '8px 12px 12px',
    display: 'grid',
    gap: '10px',
  },
  item: {
    padding: '14px',
    borderRadius: '20px',
    background: 'var(--card-bg)',
    border: '1px solid var(--line)',
  },
  itemTitle: {
    fontSize: '14px',
    fontWeight: 800,
    marginBottom: '6px',
  },
  itemCopy: {
    fontSize: '13px',
    color: 'var(--text-2)',
    lineHeight: 1.5,
  },
  itemTime: {
    fontSize: '11px',
    color: 'var(--text-3)',
    marginTop: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 700,
  },
}

export default function Navbar({ showMenuButton = false, onMenuToggle }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { isDark, toggleTheme } = useTheme()
  const { isXs, isMobile, isTabletOrBelow } = useViewport()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchValue(location.pathname === '/home/search' ? params.get('q') || '' : '')
  }, [location.pathname, location.search])

  const submitSearch = () => {
    const query = searchValue.trim()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    navigate(`/home/search${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const computedStyles = {
    bar: {
      ...styles.bar,
      flexWrap: isTabletOrBelow ? 'wrap' : 'nowrap',
      alignItems: isTabletOrBelow ? 'stretch' : styles.bar.alignItems,
      gap: isMobile ? '12px' : styles.bar.gap,
    },
    title: {
      ...styles.title,
      fontSize: isXs ? '21px' : isMobile ? '24px' : styles.title.fontSize,
    },
    right: {
      ...styles.right,
      width: isTabletOrBelow ? '100%' : 'auto',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      justifyContent: isTabletOrBelow ? 'space-between' : 'flex-start',
      gap: isMobile ? '10px' : styles.right.gap,
    },
    search: {
      ...styles.search,
      minWidth: 0,
      flex: isTabletOrBelow ? '1 1 100%' : '0 1 320px',
      width: isTabletOrBelow ? '100%' : 'auto',
      order: isTabletOrBelow ? 3 : 0,
    },
    panel: {
      ...styles.panel,
      top: isMobile ? '12px' : styles.panel.top,
      right: isMobile ? '12px' : styles.panel.right,
      width: isMobile ? 'calc(100vw - 24px)' : styles.panel.width,
      maxHeight: isMobile ? 'calc(100dvh - 24px)' : styles.panel.maxHeight,
      borderRadius: isMobile ? '24px' : styles.panel.borderRadius,
    },
  }

  return (
    <>
      <header style={computedStyles.bar}>
        <div style={{ ...styles.titleWrap, flex: isTabletOrBelow ? '1 1 auto' : '0 0 auto', minWidth: 0 }}>
          {showMenuButton ? (
            <button type="button" style={{ ...styles.iconBtn, marginBottom: '10px', width: isXs ? '42px' : styles.iconBtn.width, height: isXs ? '42px' : styles.iconBtn.height }} aria-label="Open navigation menu" onClick={onMenuToggle}>
              <Icon name="menu" size={24} />
            </button>
          ) : null}
          <span style={styles.eyebrow}>Warm Minimal Listening</span>
          <h1 style={computedStyles.title}>Symponify</h1>
        </div>
        <div style={computedStyles.right}>
          <div style={computedStyles.search}>
            <Icon name="search" size={20} />
            <input
              style={styles.input}
              placeholder="Search songs, albums, artists"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  submitSearch()
                }
              }}
            />
          </div>
          <button type="button" style={{ ...styles.iconBtn, width: isXs ? '42px' : styles.iconBtn.width, height: isXs ? '42px' : styles.iconBtn.height }} aria-label="Run search" onClick={submitSearch}>
            <Icon name="search" size={20} />
          </button>
          <button type="button" style={{ ...styles.iconBtn, width: isXs ? '42px' : styles.iconBtn.width, height: isXs ? '42px' : styles.iconBtn.height }} aria-label="Toggle dark mode" onClick={toggleTheme}>
            <Icon name={isDark ? 'light_mode' : 'dark_mode'} size={20} />
          </button>
          <button type="button" style={{ ...styles.iconBtn, width: isXs ? '42px' : styles.iconBtn.width, height: isXs ? '42px' : styles.iconBtn.height }} aria-label="Notifications" onClick={() => setShowNotifications(true)}>
            <Icon name="notifications" size={20} />
            <span style={styles.dot} />
          </button>
        </div>
      </header>

      {showNotifications ? (
        <>
          <button type="button" aria-label="Close notifications" style={styles.overlay} onClick={() => setShowNotifications(false)} />
          <aside style={computedStyles.panel}>
            <div style={styles.panelHeader}>
              <div style={styles.panelTitle}>Notifications</div>
              <button type="button" style={styles.closeButton} onClick={() => setShowNotifications(false)} aria-label="Close notification panel">
                <Icon name="close" size={20} />
              </button>
            </div>
            <div style={styles.panelBody}>
              {notifications.map((item) => (
                <div key={`${item.title}-${item.time}`} style={styles.item}>
                  <div style={styles.itemTitle}>{item.title}</div>
                  <div style={styles.itemCopy}>{item.copy}</div>
                  <div style={styles.itemTime}>{item.time}</div>
                </div>
              ))}
            </div>
          </aside>
        </>
      ) : null}
    </>
  )
}
