import { useEffect, useState } from 'react'

const getWidth = () => (typeof window === 'undefined' ? 1280 : window.innerWidth)

export default function useViewport() {
  const [width, setWidth] = useState(getWidth)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    width,
    isXs: width <= 320,
    isMobile: width <= 480,
    isTablet: width > 480 && width <= 768,
    isTabletOrBelow: width <= 768,
    isSmallLaptop: width > 768 && width <= 1024,
    isCompact: width <= 1024,
    isDesktop: width > 1024 && width < 1440,
    isLargeScreen: width >= 1025,
    isWide: width >= 1440,
  }
}
