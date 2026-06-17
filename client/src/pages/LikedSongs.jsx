import { FiHeart } from 'react-icons/fi'
import SongRow from '../components/SongRow'
import { usePlayer } from '../context/PlayerContext'
import useViewport from '../hooks/useViewport'

const styles = {
  page: {
    padding: '28px',
    overflowY: 'auto',
    height: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '28px',
    padding: '28px',
    borderRadius: '32px',
    background: 'linear-gradient(135deg, #c9184a, #ff758f)',
    color: '#fff',
  },
  iconWrap: {
    width: '78px',
    height: '78px',
    borderRadius: '24px',
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(255,255,255,0.14)',
  },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: '34px',
    marginBottom: '6px',
  },
  sub: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.78)',
  },
  empty: {
    minHeight: '320px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '30px',
    background: 'var(--card-bg)',
    border: '1px solid var(--line)',
    boxShadow: 'var(--shadow-soft)',
    textAlign: 'center',
    padding: '24px',
  },
  emptyIcon: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: 'var(--surface)',
    margin: '0 auto 14px',
    color: '#c9184a',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 800,
    marginBottom: '6px',
  },
  emptyCopy: {
    color: 'var(--text-3)',
  },
}

export default function LikedSongs() {
  const { likedSongs } = usePlayer()
  const { isMobile, isTabletOrBelow, isWide } = useViewport()

  return (
    <div style={{ ...styles.page, padding: isMobile ? '16px' : isTabletOrBelow ? '20px' : styles.page.padding, width: '100%', maxWidth: isWide ? '1320px' : '100%', marginInline: 'auto' }} className="scrollbar-hidden">
      <section style={{ ...styles.header, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', padding: isMobile ? '20px' : styles.header.padding, borderRadius: isMobile ? '24px' : styles.header.borderRadius }}>
        <div style={{ ...styles.iconWrap, width: isMobile ? '64px' : styles.iconWrap.width, height: isMobile ? '64px' : styles.iconWrap.height }}>
          <FiHeart size={isMobile ? 26 : 32} />
        </div>
        <div>
          <h1 style={{ ...styles.title, fontSize: isMobile ? '28px' : styles.title.fontSize }}>Liked Songs</h1>
          <p style={styles.sub}>{likedSongs.length} saved songs</p>
        </div>
      </section>

      {likedSongs.length ? (
        likedSongs.map((song, index) => <SongRow key={song._id} song={song} index={index + 1} />)
      ) : (
        <section style={styles.empty}>
          <div>
            <div style={styles.emptyIcon}>
              <FiHeart size={28} />
            </div>
            <div style={styles.emptyTitle}>No liked songs yet</div>
            <p style={styles.emptyCopy}>Tap the heart on any song row and it will show up here.</p>
          </div>
        </section>
      )}
    </div>
  )
}
