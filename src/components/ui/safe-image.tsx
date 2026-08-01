import { ImageOff } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { illustrations } from '../../assets/illustrations'
import { cn } from '../../lib/utils'

type SafeImageProps = {
  src?: string | null
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  fallback?: ReactNode
  fallbackSrc?: string
  /** Optional glass gradient overlay (hero / detail galleries). */
  overlay?: 'none' | 'glass'
}

export function SafeImage({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  fetchPriority,
  fallback,
  fallbackSrc,
  overlay = 'none',
}: SafeImageProps) {
  const [stage, setStage] = useState<'primary' | 'fallback' | 'gone'>(() =>
    src ? 'primary' : fallbackSrc ? 'fallback' : 'gone',
  )

  const displaySrc =
    stage === 'primary' ? src : stage === 'fallback' ? fallbackSrc : null

  if (!displaySrc) {
    return (
      <>
        {fallback ?? (
          <div
            className={cn(
              'flex items-center justify-center bg-surface text-muted ring-1 ring-line',
              className,
            )}
            role="img"
            aria-label={alt || 'Image unavailable'}
          >
            <ImageOff className="h-8 w-8 opacity-60" aria-hidden />
          </div>
        )}
      </>
    )
  }

  if (overlay === 'glass') {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        <img
          src={displaySrc}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          className="h-full w-full object-cover"
          onError={() => {
            if (stage === 'primary' && fallbackSrc) {
              setStage('fallback')
              return
            }
            setStage('gone')
          }}
        />
        <div className="glass-overlay pointer-events-none absolute inset-0" aria-hidden />
      </div>
    )
  }

  return (
    <img
      src={displaySrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      className={className}
      onError={() => {
        if (stage === 'primary' && fallbackSrc) {
          setStage('fallback')
          return
        }
        setStage('gone')
      }}
    />
  )
}

type ListingCoverProps = {
  imageUrls?: string[] | null
  alt: string
  className?: string
  rounded?: 'top' | 'all' | 'none'
  overlay?: 'none' | 'glass'
}

/** Card/cover media: first listing photo or brand placeholder. Never blank. */
export function ListingCover({
  imageUrls,
  alt,
  className,
  rounded = 'top',
  overlay = 'none',
}: ListingCoverProps) {
  const src = imageUrls && imageUrls.length > 0 ? imageUrls[0] : null
  const radius =
    rounded === 'top'
      ? 'rounded-t-2xl'
      : rounded === 'all'
        ? 'rounded-2xl'
        : ''

  return (
    <div
      className={cn(
        'relative aspect-[16/10] w-full overflow-hidden bg-surface',
        radius,
        className,
      )}
    >
      <SafeImage
        src={src}
        alt={alt}
        fallbackSrc={illustrations.coverPlaceholder}
        loading="lazy"
        overlay={overlay}
        className="h-full w-full object-cover"
        fallback={
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/10 to-surface">
            <ImageOff className="h-10 w-10 text-muted" aria-hidden />
          </div>
        }
      />
    </div>
  )
}
