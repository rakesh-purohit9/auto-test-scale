'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient'
  hover?: boolean
  selected?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, selected = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-card border border-border',
      glass: 'glass',
      gradient: 'bg-gradient-to-br from-card to-card/50 border border-border/50',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-6 transition-all duration-300',
          variants[variant],
          hover && 'cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5',
          selected && 'border-primary ring-2 ring-primary/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card }
