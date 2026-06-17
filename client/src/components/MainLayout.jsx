import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import PlayerBar from './PlayerBar'
import Sidebar from './Sidebar'
import useViewport from '../hooks/useViewport'
import { pageVariants, drawerVariants, backdropVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import GsapAmbient from './visuals/GsapAmbient'

export default function MainLayout() {
  const { isCompact, isTabletOrBelow, isWide } = useViewport()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!isCompact) {
      setIsSidebarOpen(false)
    }
  }, [isCompact])

  const layoutStyles = {
    shell: {
      display: isCompact ? 'flex' : 'grid',
      flexDirection: isCompact ? 'column' : undefined,
      gridTemplateColumns: isCompact ? undefined : isWide ? '320px minmax(0, 1fr)' : '280px minmax(0, 1fr)',
      gridTemplateRows: isCompact ? undefined : '1fr auto',
      gap: isCompact ? '10px' : '18px',
      height: isCompact ? 'auto' : '100dvh',
      minHeight: '100dvh',
      overflow: isCompact ? 'visible' : 'hidden',
      padding: isCompact ? '12px' : 'var(--page-pad)',
      width: 'min(100%, var(--page-max))',
      marginInline: 'auto',
      minWidth: 0,
    },
    mainPanel: {
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: isCompact ? '10px' : '18px',
      flex: 1,
      minWidth: 0,
      paddingBottom: isCompact ? 'calc(156px + 12px)' : 0,
    },
    content: {
      flex: 1,
      minHeight: isCompact ? 'auto' : 0,
      background: 'var(--content-bg)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--line)',
      borderRadius: isTabletOrBelow ? '24px' : '32px',
      boxShadow: 'var(--shadow)',
      overflow: 'hidden',
      width: '100%',
      minWidth: 0,
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'var(--overlay)',
      zIndex: 39,
    },
  }

  const pageVariantsWithReducedMotion = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : pageVariants

  return (
    <div style={layoutStyles.shell} className="app-shell relative isolate">
      <GsapAmbient variant="app" />
      {isCompact && isSidebarOpen && (
        <motion.button
          type="button"
          aria-label="Close navigation menu"
          style={layoutStyles.overlay}
          onClick={() => setIsSidebarOpen(false)}
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      )}
      <Sidebar isCompact={isCompact} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div style={layoutStyles.mainPanel}>
        <Navbar showMenuButton={isCompact} onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />
        <motion.div
          style={layoutStyles.content}
          variants={pageVariantsWithReducedMotion}
          initial="initial"
          animate="animate"
          exit="exit"
          key={location.pathname}
        >
          <Outlet />
        </motion.div>
      </div>
      {!isCompact || !isSidebarOpen ? <PlayerBar /> : null}
    </div>
  )
}
