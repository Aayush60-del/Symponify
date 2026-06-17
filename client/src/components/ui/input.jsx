import React from 'react'

export const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`flex min-h-11 h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--input-bg)] px-3 py-2 text-base text-[var(--text)] placeholder-[var(--input-placeholder)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,122,0,0.22)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
))
Input.displayName = 'Input'
