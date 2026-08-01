import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { DISTRICT_CHIPS } from './constants'

type HeroSearchProps = {
  liveCount?: number | null
}

export function HeroSearch({ liveCount }: HeroSearchProps) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [district, setDistrict] = useState('Colombo')

  function go(nextDistrict: string, nextQ = q) {
    const params = new URLSearchParams()
    const trimmed = nextQ.trim()
    if (trimmed) params.set('q', trimmed)
    if (nextDistrict) params.set('district', nextDistrict)
    const qs = params.toString()
    navigate(qs ? `/browse?${qs}` : '/browse')
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    go(district || 'Colombo')
  }

  return (
    <div className="w-full max-w-2xl">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-md sm:flex-row sm:items-center sm:rounded-full sm:p-1.5"
        role="search"
        aria-label="Search boarding places"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 sm:py-1">
          <Search className="h-5 w-5 shrink-0 text-[#132A22]/60" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Colombo, Kandy, campus…"
            className="min-w-0 flex-1 border-0 bg-transparent text-base text-[#132A22] outline-none placeholder:text-[#132A22]/45"
            aria-label="Keyword or area"
          />
        </div>
        <label className="sr-only" htmlFor="hero-district">
          District
        </label>
        <select
          id="hero-district"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="mx-2 rounded-xl border border-[#132A22]/12 bg-[#f8f4ec] px-3 py-2 text-sm font-semibold text-[#132A22] sm:mx-0 sm:max-w-[9.5rem]"
        >
          <option value="Colombo">Colombo</option>
          <option value="Gampaha">Gampaha</option>
          <option value="Kandy">Kandy</option>
          <option value="Galle">Galle</option>
          <option value="Matara">Matara</option>
          <option value="Kurunegala">Kurunegala</option>
        </select>
        <button
          type="submit"
          className="w-full rounded-xl bg-teal-deep px-6 py-3 text-sm font-bold text-white transition hover:brightness-110 sm:w-auto sm:rounded-full sm:py-2.5"
        >
          Explore
        </button>
      </form>

      <p className="mt-3 text-center text-sm text-white/80 sm:text-left">
        Best places near campus &amp; work · Reviewed before they go live
        {typeof liveCount === 'number' && liveCount > 0
          ? ` · ${liveCount} live rooms`
          : ' · Free to browse · Contact after signup'}
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
        {DISTRICT_CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => {
              setDistrict(chip.district)
              go(chip.district, chip.label)
            }}
            className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30 backdrop-blur-sm transition hover:bg-white/25"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  )
}
