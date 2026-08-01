/**
 * One-off: rasterize brand SVGs to transparent PNGs.
 * Run: node scripts/rasterize-brand.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const brandDir = join(__dirname, '../public/brand')

const sizes = {
  'stayspot-mark.svg': { width: 512, height: 512 },
  'stayspot-mark-light.svg': { width: 512, height: 512 },
  'stayspot-wordmark.svg': { width: 1024, height: 256 },
  'stayspot-wordmark-light.svg': { width: 1024, height: 256 },
  'stayspot-lockup.svg': { width: 1280, height: 284 },
  'stayspot-lockup-light.svg': { width: 1280, height: 284 },
}

for (const [file, size] of Object.entries(sizes)) {
  const svgPath = join(brandDir, file)
  const pngPath = join(brandDir, file.replace(/\.svg$/, '.png'))
  const svg = readFileSync(svgPath)
  await sharp(svg, { density: 300 })
    .resize(size.width, size.height, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(pngPath)
  console.log('wrote', pngPath)
}

console.log('done', readdirSync(brandDir).filter((f) => f.endsWith('.png')).join(', '))
