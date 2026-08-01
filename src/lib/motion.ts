import { useReducedMotion, type Transition, type Variants } from 'framer-motion'

/** Soft SaaS-style motion presets. Durations stay under 0.35s. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1 },
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 },
}

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

export const pageTransition: Transition = {
  duration: 0.25,
  ease: [0.22, 1, 0.36, 1],
}

export const softTransition: Transition = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
}

export const viewOnce = {
  once: true,
  amount: 0.2 as const,
}

/** Prefer Framer's hook; returns true when the OS asks to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  return Boolean(useReducedMotion())
}

/** Instant no-op transition when reduced motion is preferred. */
export function motionSafe(
  reduced: boolean,
  transition: Transition = softTransition,
): Transition {
  return reduced ? { duration: 0 } : transition
}
