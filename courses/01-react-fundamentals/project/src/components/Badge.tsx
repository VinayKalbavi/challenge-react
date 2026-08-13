import type { ReactNode } from 'react'

export interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'category' | 'priority' | 'tag'
}

export default function Badge({
  children,
  variant = 'default',
}: BadgeProps) {
  return (
    <span
      className={`badge badge-${variant}`}
      data-variant={variant}
    >
      {children}
    </span>
  )
}