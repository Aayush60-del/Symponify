import React from 'react'
import { motion } from 'framer-motion'

const buttonVariants = {
  variants: {
    default: 'bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-white hover:opacity-90',
    outline: 'border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--accent-soft)]',
    ghost: 'text-[var(--text)] hover:bg-[var(--accent-soft)]',
    secondary: 'bg-[var(--surface-elevated)] text-[var(--text)] hover:bg-[var(--surface-3)]',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    link: 'text-accent underline-offset-4 hover:underline',
  },
  sizes: {
    sm: 'px-3 py-1.5 text-sm min-h-9',
    md: 'px-4 py-2.5 text-base min-h-11',
    lg: 'px-6 py-3 text-lg h-12 min-h-12',
    icon: 'h-11 w-11 min-h-11 min-w-11',
  },
}

export const Button = React.forwardRef(
  ({ className = '', variant = 'default', size = 'md', asMotion = false, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

    const buttonClass = `${baseStyles} ${buttonVariants.variants[variant] || buttonVariants.variants.default} ${buttonVariants.sizes[size] || buttonVariants.sizes.md} ${className}`

    const Component = asMotion ? motion.button : 'button'

    const motionProps = asMotion
      ? {
          whileHover: { scale: 1.02, transition: { duration: 0.2 } },
          whileTap: { scale: 0.98 },
        }
      : {}

    return (
      <Component ref={ref} className={buttonClass} {...motionProps} {...props} />
    )
  }
)

Button.displayName = 'Button'
