import React from 'react'

// Hook to check if user prefers reduced motion
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Utility to create accessible transitions
export const createAccessibleTransition = (reducedMotion, normalTransition) => {
  return reducedMotion ? { duration: 0.01 } : normalTransition
}

// Hook for page transitions
export const usePageTransition = () => {
  const prefersReducedMotion = useReducedMotion()

  const pageTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }

  return pageTransition
}

// Hook for debouncing animation values
export const useAnimationDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
