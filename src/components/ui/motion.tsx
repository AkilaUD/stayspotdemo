import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  fadeUp,
  softTransition,
  staggerContainer,
  usePrefersReducedMotion,
  viewOnce,
} from '../../lib/motion'

/** Fade-up when scrolled into view (once). Honors reduced motion. */
export function MotionSection({
  children,
  className,
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  const reduce = usePrefersReducedMotion()
  return (
    <motion.section
      id={id}
      className={className}
      variants={fadeUp}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={viewOnce}
      transition={softTransition}
    >
      {children}
    </motion.section>
  )
}

/** Stagger children on mount. */
export function MotionStagger({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = usePrefersReducedMotion()
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial={reduce ? false : 'hidden'}
      animate="show"
    >
      {children}
    </motion.div>
  )
}

export function MotionFade({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = usePrefersReducedMotion()
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial={reduce ? false : 'hidden'}
      animate="show"
      transition={softTransition}
    >
      {children}
    </motion.div>
  )
}
