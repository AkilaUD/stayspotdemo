import { useEffect } from 'react'

type SeoProps = {
  title?: string
  description?: string
}

export function Seo({
  title = 'StaySpot | Reviewed boarding places in Sri Lanka',
  description = 'StaySpot — reviewed boarding places across Sri Lanka. Browse free as a renter. List rooms with monthly plans and boosts as a landlord.',
}: SeoProps) {
  useEffect(() => {
    document.title = title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)

    let script = document.getElementById('stayspot-jsonld')
    if (!script) {
      script = document.createElement('script')
      script.id = 'stayspot-jsonld'
      script.setAttribute('type', 'application/ld+json')
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: 'StaySpot',
          url: typeof window !== 'undefined' ? window.location.origin : 'https://stayspot.lk',
          description,
        },
        {
          '@type': 'WebSite',
          name: 'StaySpot',
          url: typeof window !== 'undefined' ? window.location.origin : 'https://stayspot.lk',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${typeof window !== 'undefined' ? window.location.origin : ''}/browse?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    })
  }, [title, description])

  return null
}
