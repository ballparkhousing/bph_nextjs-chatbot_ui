import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      Copyright (c) 2024 | 
      <ExternalLink href="https://ballparkhousing.com">BallPark Housing</ExternalLink>.
    </p>
  )
}
