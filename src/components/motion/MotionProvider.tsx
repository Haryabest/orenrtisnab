import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import type { ReactNode } from 'react'
import { SmoothScroll } from './SmoothScroll'

type MotionProviderProps = {
  children: ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <SmoothScroll>{children}</SmoothScroll>
      </MotionConfig>
    </LazyMotion>
  )
}
