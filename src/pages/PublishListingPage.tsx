import { ImagePlus, MapPinned, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { createAdvertiserListing } from '../api'
import { useAuth } from '../AuthContext'
import { Button, buttonVariants } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Alert, PageHeader } from '../components/ui/feedback'
import { Input, Label, Select, Textarea } from '../components/ui/input'
import { MotionFade } from '../components/ui/motion'
import { cn } from '../lib/utils'

const DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Galle',
  'Matara',
  'Kurunegala',
  'Jaffna',
] as const

export function PublishListingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const welcome = params.get('welcome') === '1'
  const [error, setError] = useState<string | null>(null)
  const [slotLimited, setSlotLimited] = useState(false)
  const [busy, setBusy] = useState(false)
  const [adType, setAdType] = useState<'RENT' | 'LEASE'>('RENT')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADVERTISER') {
    return (
      <div>
        <Alert variant="error" className="mb-4">
          Only advertiser accounts can publish listings.
        </Alert>
        <Link to="/browse" className={cn(buttonVariants({ variant: 'outline' }))}>
          Home
        </Link>
      </div>
    )
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSlotLimited(false)

    if (files && files.length > 6) {
      setError('At most 6 images are allowed.')
      return
    }
    if (files) {
      for (const f of Array.from(files)) {
        if (f.size > 1024 * 1024) {
          setError(`Image ${f.name} exceeds 1MB.`)
          return
        }
        if (!/^image\/(jpeg|jpg|png)$/i.test(f.type)) {
          setError('Images must be PNG or JPG.')
          return
        }
      }
    }

    const formEl = e.currentTarget
    const fd = new FormData(formEl)
    fd.set('adType', adType)
    if (files) {
      for (const f of Array.from(files)) fd.append('images', f)
    }

    setBusy(true)
    try {
      const created = await createAdvertiserListing(fd)
      navigate('/advertiser/ads', {
        state: {
          flash: `Submitted ${created.publicCode} for approval (${created.status}).`,
        },
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submit failed'
      setError(message)
      if (/slot limit|SLOT_LIMIT|upgrade/i.test(message)) setSlotLimited(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <MotionFade className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Advertiser console"
        title="Publish boarding place"
        description="Submit for admin review. Guests will not see this listing until it is approved."
      />

      <div className="glass-panel mb-6 rounded-2xl border border-accent/30 p-4 ring-1 ring-accent/20">
        <p className="font-display text-lg font-semibold text-ink">
          {welcome
            ? 'Your free Starter slot is ready'
            : 'Publish into your plan slots'}
        </p>
        <p className="mt-1 text-sm text-muted">
          Starter includes one live+pending ad. Need more properties?{' '}
          <Link to="/pricing" className="font-semibold text-accent no-underline">
            See Growth
          </Link>
          .
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => void onSubmit(e)}>
        <Card>
          <CardHeader>
            <CardTitle>Basics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Label required>
              Ad name / title
              <Input
                name="title"
                required
                maxLength={200}
                placeholder="Sunny room near UoM"
              />
            </Label>
            <div>
              <p className="mb-2 text-sm font-medium text-ink">Ad type</p>
              <div className="inline-flex rounded-xl glass-panel-dense p-1">
                <Button
                  type="button"
                  size="sm"
                  variant={adType === 'RENT' ? 'primary' : 'ghost'}
                  onClick={() => setAdType('RENT')}
                >
                  Rent
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={adType === 'LEASE' ? 'primary' : 'ghost'}
                  onClick={() => setAdType('LEASE')}
                >
                  Lease
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Label required>
                Price (LKR / month)
                <Input
                  name="priceLkrMonth"
                  type="number"
                  min={1}
                  step="1"
                  required
                  defaultValue={20000}
                />
              </Label>
              <Label required>
                Discount %
                <Input
                  name="discountPercent"
                  type="number"
                  min={0}
                  max={100}
                  required
                  defaultValue={0}
                />
              </Label>
            </div>
            <Label>
              Rent time term
              <Input
                name="rentTimeTerm"
                placeholder="Monthly"
                defaultValue="Monthly"
              />
            </Label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinned className="h-5 w-5 text-accent" aria-hidden />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Label required>
                City
                <Input name="city" required placeholder="Moratuwa" />
              </Label>
              <Label required>
                District
                <Select name="district" required defaultValue="Colombo">
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </Label>
            </div>
            <Label required>
              Exact location description
              <Input
                name="locationDescription"
                required
                maxLength={500}
                placeholder="Street, landmark, gate notes"
              />
            </Label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Label>
                Map latitude
                <Input
                  name="mapLat"
                  type="number"
                  step="any"
                  placeholder="6.795"
                />
              </Label>
              <Label>
                Map longitude
                <Input
                  name="mapLng"
                  type="number"
                  step="any"
                  placeholder="79.9007"
                />
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Label required>
              Description ({description.length}/500)
              <Textarea
                name="description"
                required
                maxLength={500}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Room features, house rules, distance to campus…"
              />
            </Label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Label required>
                Bedrooms
                <Input
                  name="bedrooms"
                  type="number"
                  min={0}
                  required
                  defaultValue={1}
                />
              </Label>
              <Label required>
                Bathrooms
                <Input
                  name="bathrooms"
                  type="number"
                  min={0}
                  required
                  defaultValue={1}
                />
              </Label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Label>
                Parking
                <Select name="parking" defaultValue="None">
                  <option>None</option>
                  <option>Street</option>
                  <option>Private</option>
                </Select>
              </Label>
              <Label>
                Separate entrance
                <Select name="separateEntrance" defaultValue="Shared">
                  <option>Shared</option>
                  <option>Private</option>
                  <option>Building</option>
                </Select>
              </Label>
            </div>
            <Label>
              Furniture
              <Select name="furniture" defaultValue="Furnished">
                <option>Furnished</option>
                <option>Semi-furnished</option>
                <option>Unfurnished</option>
              </Select>
            </Label>
            <Label required>
              Contact phone (+94…)
              <Input
                name="contactPhone"
                required
                pattern="\+94\d{9}"
                placeholder="+94771234567"
                defaultValue="+94771234567"
              />
            </Label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-accent" aria-hidden />
              Photos (max 6, PNG/JPG ≤1MB)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="file"
              accept="image/png,image/jpeg"
              multiple
              className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-accent/15 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[#8a5a18]"
              onChange={(e) => setFiles(e.target.files)}
            />
            {files && files.length > 0 && (
              <p className="mt-2 text-sm text-muted">
                {files.length} file(s) selected
              </p>
            )}
          </CardContent>
        </Card>

        {error && <Alert variant="error">{error}</Alert>}
        {slotLimited && (
          <Link
            to="/pricing"
            className={cn(buttonVariants({ variant: 'primary' }), 'inline-flex')}
          >
            View plans & upgrade
          </Link>
        )}

        <Button type="submit" size="lg" loading={busy} disabled={slotLimited}>
          <Send className="h-4 w-4" aria-hidden />
          {busy ? 'Submitting…' : 'Submit for approval'}
        </Button>
      </form>
    </MotionFade>
  )
}
