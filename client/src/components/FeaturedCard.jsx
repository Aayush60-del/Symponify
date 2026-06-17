import { motion } from 'framer-motion'
import useViewport from '../hooks/useViewport'
import { useReducedMotion } from '../lib/animation-utils'

const Icon = ({ name, size = 20, style: extraStyle }) => (
  <span className="material-symbols-rounded" style={{ fontSize: size, lineHeight: 1, ...extraStyle }}>{name}</span>
)

const baseCardStyle = (item, clickable) => ({
  minHeight: item.large ? '240px' : '114px',
  borderRadius: item.large ? '28px' : '20px',
  padding: item.large ? '28px' : '18px',
  background: item.background,
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  position: 'relative',
  overflow: 'hidden',
  textAlign: 'left',
  width: '100%',
  cursor: clickable ? 'pointer' : 'default',
})

export default function FeaturedCard({ item, onAction }) {
  const { isMobile, isTabletOrBelow, isWide } = useViewport()
  const prefersReducedMotion = useReducedMotion()

  const cardStyle = {
    ...baseCardStyle(item, Boolean(onAction) && !item.large),
    minHeight: item.large ? (isMobile ? '220px' : isWide ? '280px' : '240px') : isMobile ? '104px' : '114px',
    borderRadius: isTabletOrBelow ? '22px' : item.large ? '28px' : '20px',
    padding: item.large ? (isMobile ? '20px' : '28px') : isMobile ? '16px' : '18px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
  }

  const hoverVariants = prefersReducedMotion ? {} : {
    hover: { scale: 1.02, y: -4, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
  }

  const Badge = () => item.badge ? (
    <span
      style={{
        alignSelf: 'flex-start',
        background: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(8px)',
        padding: '6px 12px',
        borderRadius: '999px',
        fontSize: '11px',
        letterSpacing: '0.08em',
        fontWeight: 700,
        marginBottom: '12px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {item.badge}
    </span>
  ) : null

  if (!item.large && onAction) {
    return (
      <motion.button 
        type="button" 
        style={cardStyle} 
        onClick={onAction} 
        aria-label={`Open ${item.title}`}
        variants={hoverVariants}
        whileHover="hover"
      >
        <Badge />
        <h2 style={{ fontSize: isMobile ? '18px' : '20px', marginBottom: '8px' }}>{item.title}</h2>
        <p style={{ maxWidth: isMobile ? '100%' : '32ch', color: 'rgba(255,255,255,0.72)', marginBottom: 0, overflowWrap: 'break-word' }}>
          {item.description}
        </p>
      </motion.button>
    )
  }

  return (
    <motion.div 
      style={cardStyle}
      variants={item.large ? undefined : hoverVariants}
      whileHover={item.large ? undefined : "hover"}
    >
      <Badge />
      <h2 style={{ fontSize: item.large ? (isMobile ? '28px' : isWide ? '40px' : '36px') : isMobile ? '18px' : '20px', marginBottom: '8px' }}>{item.title}</h2>
      <p style={{ maxWidth: isMobile ? '100%' : '32ch', color: 'rgba(255,255,255,0.72)', marginBottom: item.large ? '18px' : 0, overflowWrap: 'break-word' }}>
        {item.description}
      </p>
      {item.large && onAction ? (
        <motion.button
          type="button"
          style={{
            width: isMobile ? '100%' : 'fit-content',
            padding: '12px 20px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.95)',
            color: 'var(--text)',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
          }}
          onClick={onAction}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
        >
          <Icon name="play_arrow" size={20} /> Play Mix
        </motion.button>
      ) : null}
    </motion.div>
  )
}
