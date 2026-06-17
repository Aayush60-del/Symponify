import React from 'react'

export const Textarea = React.forwardRef(({ className = '', ...props }, ref) => (
  <textarea
    ref={ref}
    className={`flex min-h-[80px] w-full rounded-lg border border-[var(--line)] bg-[var(--input-bg)] px-3 py-2 text-base text-[var(--text)] placeholder-[var(--input-placeholder)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,122,0,0.22)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
))
Textarea.displayName = 'Textarea'
