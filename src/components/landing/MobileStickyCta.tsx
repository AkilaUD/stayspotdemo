import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function MobileStickyCta() {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-glass-border)] p-3 md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-lg gap-2">
        <Link
          to="/browse"
          className="flex-1 rounded-full bg-accent px-3 py-3 text-center text-sm font-bold text-[#132A22] no-underline shadow-[0_0_20px_rgba(232,177,104,0.35)]"
        >
          Find a room
        </Link>
        <Link
          to="/register?role=ADVERTISER"
          className="flex-1 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-glass-surface)] px-3 py-3 text-center text-sm font-bold text-ink no-underline"
        >
          List a room
        </Link>
      </div>
    </motion.div>
  )
}
