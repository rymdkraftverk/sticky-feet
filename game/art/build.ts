#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run=magick

const PADDING = 2
const MAX_WIDTH = 2048

const SPRITE_PIXEL = 2
const PIXEL: Record<string, number> = { chevron: 4 }

const LAYERED = ['astronaut-side-1', 'astronaut-side-2', 'astronaut-front-1', 'astronaut-front-2']

const SUIT = 'suit'
const GEAR = 'gear'

const PALETTE: Record<string, { layer: string, color: string }> = {
  W: { layer: SUIT, color: '#ffffff' },
  w: { layer: SUIT, color: '#c9c9d1' },
  o: { layer: GEAR, color: '#e6e9f4' },
  v: { layer: GEAR, color: '#1b2438' },
  b: { layer: GEAR, color: '#9fdcff' },
  g: { layer: GEAR, color: '#7f8494' },
  d: { layer: GEAR, color: '#4b4f5e' },
  r: { layer: GEAR, color: '#ff5e5e' },
  n: { layer: GEAR, color: '#6dff8a' },
  T: { layer: GEAR, color: '#2a2440' },
  P: { layer: GEAR, color: '#b39dff' },
  h: { layer: GEAR, color: '#ffffff' },
  Y: { layer: GEAR, color: '#ffcf3f' },
  y: { layer: GEAR, color: '#e0a92a' },
  R: { layer: GEAR, color: '#ff5e5e' },
  G: { layer: GEAR, color: '#6dff8a' },
  C: { layer: GEAR, color: '#ffffff' },
}

const DOME_CELLS = 180
const DOME_PIXEL = 4
const GROUND_RADIUS = 87.5
const CRATERS = [
  { x: 18, y: 18, r: 9 }, { x: 160, y: 22, r: 6 }, { x: 24, y: 158, r: 7 }, { x: 158, y: 160, r: 10 },
  { x: 172, y: 90, r: 4 }, { x: 90, y: 173, r: 5 }, { x: 7, y: 95, r: 4 }, { x: 92, y: 6, r: 4 },
  { x: 150, y: 50, r: 3 }, { x: 40, y: 140, r: 3 },
]
const SPACE = '#070a14'
const STAR = '#ffffff'
const PALE_STAR = '#9fb8e6'
const ROCK = '#3a3446'
const ROCK_DARK = '#2b2735'
const ROCK_LIGHT = '#4d4660'
const CRUST = '#7a7194'
const CRUST_DARK = '#5c5473'
const CRATER = '#221d2c'
const CRATER_RIM = '#5a5270'

const artDir = new URL('.', import.meta.url)
const outDir = new URL('../public/spritesheet/', import.meta.url)

type Rgba = [number, number, number, number]
type Image = { w: number, h: number, pixels: Rgba[] }

const CLEAR: Rgba = [0, 0, 0, 0]

const rgba = (hex: string): Rgba => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
  255,
]

const run = async (args: string[]) => {
  const { success, stderr } = await new Deno.Command('magick', { args }).output()
  if (!success) throw new Error(new TextDecoder().decode(stderr))
}

const writePam = async (path: string, { w, h, pixels }: Image) => {
  const header = `P7\nWIDTH ${w}\nHEIGHT ${h}\nDEPTH 4\nMAXVAL 255\nTUPLTYPE RGB_ALPHA\nENDHDR\n`
  const body = new Uint8Array(pixels.flat())
  await Deno.writeFile(path, new Uint8Array([...new TextEncoder().encode(header), ...body]))
}

const readMap = (name: string) => {
  const rows = Deno.readTextFileSync(new URL(`${name}.txt`, artDir)).trimEnd().split('\n')
  const w = rows[0].length
  rows.forEach((row, index) => {
    if (row.length !== w) throw new Error(`${name}.txt row ${index} is ${row.length} wide, expected ${w}`)
    ;[...row].forEach((char) => {
      if (char !== '.' && !PALETTE[char]) throw new Error(`${name}.txt has unknown pixel "${char}"`)
    })
  })
  return { w, h: rows.length, rows }
}

const paint = ({ w, h, rows }: ReturnType<typeof readMap>, layer?: string): Image => ({
  w,
  h,
  pixels: rows.flatMap(row => [...row].map((char) => {
    const entry = PALETTE[char]
    if (!entry || (layer && entry.layer !== layer)) return CLEAR
    return rgba(entry.color)
  })),
})

const hash = (x: number, y: number, seed: number) => {
  const a = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 982451653)
  const b = Math.imul(a ^ (a >>> 13), 1274126177)
  return ((b ^ (b >>> 16)) >>> 0) / 4294967296
}

const crater = (x: number, y: number) => CRATERS
  .map(({ x: cx, y: cy, r }) => ({ r, d: Math.hypot(x - cx, y - cy), lit: (x - cx) + (y - cy) < 0 }))
  .find(({ r, d }) => d < r)

const domeCell = (x: number, y: number) => {
  const d = Math.hypot(x + 0.5 - DOME_CELLS / 2, y + 0.5 - DOME_CELLS / 2)
  if (d < GROUND_RADIUS - 1.5) {
    if (hash(x, y, 1) < 0.0025) return STAR
    if (hash(x, y, 1) < 0.005) return PALE_STAR
    return SPACE
  }
  if (d < GROUND_RADIUS) return hash(x, y, 3) < 0.2 ? CRUST_DARK : CRUST
  const hit = crater(x, y)
  if (hit) return hit.d > hit.r - 1.5 && hit.lit ? CRATER_RIM : CRATER
  if (hash(x, y, 2) < 0.08) return ROCK_DARK
  if (hash(x, y, 2) < 0.12) return ROCK_LIGHT
  return ROCK
}

const dome = (): Image => ({
  w: DOME_CELLS,
  h: DOME_CELLS,
  pixels: Array.from({ length: DOME_CELLS * DOME_CELLS }, (_, i) => (
    rgba(domeCell(i % DOME_CELLS, Math.floor(i / DOME_CELLS)))
  )),
})

type Frame = { name: string, path: string, w: number, h: number }

const rasterize = async (tmp: string, name: string, image: Image, pixel: number): Promise<Frame> => {
  const pamPath = `${tmp}/${name}.pam`
  const pngPath = `${tmp}/${name}.png`
  await writePam(pamPath, image)
  await run([pamPath, '-scale', `${pixel * 100}%`, pngPath])
  return { name, path: pngPath, w: image.w * pixel, h: image.h * pixel }
}

const variants = (name: string) => {
  const map = readMap(name)
  return LAYERED.includes(name)
    ? [SUIT, GEAR].map(layer => ({ name: `${name}-${layer}`, image: paint(map, layer) }))
    : [{ name, image: paint(map) }]
}

const pack = (frames: Frame[]) => {
  const sorted = frames.slice().sort((a, b) => b.h - a.h || a.name.localeCompare(b.name))
  const placed = sorted.reduce((acc, frame) => {
    const fits = acc.x + frame.w + PADDING <= MAX_WIDTH
    const x = fits ? acc.x : PADDING
    const y = fits ? acc.y : acc.y + acc.rowHeight + PADDING
    const rowHeight = fits ? Math.max(acc.rowHeight, frame.h) : frame.h
    return {
      x: x + frame.w + PADDING,
      y,
      rowHeight,
      width: Math.max(acc.width, x + frame.w + PADDING),
      frames: [...acc.frames, { ...frame, x, y }],
    }
  }, { x: PADDING, y: PADDING, rowHeight: 0, width: 0, frames: [] as (Frame & { x: number, y: number })[] })
  return { frames: placed.frames, width: placed.width, height: placed.y + placed.rowHeight + PADDING }
}

const main = async () => {
  const tmp = await Deno.makeTempDir()
  const sources = [...Deno.readDirSync(artDir)]
    .filter(entry => entry.name.endsWith('.txt'))
    .map(entry => entry.name.replace(/\.txt$/, ''))
    .sort()

  const frames = await Promise.all([
    rasterize(tmp, 'dome', dome(), DOME_PIXEL),
    ...sources.flatMap(name => variants(name).map(
      variant => rasterize(tmp, variant.name, variant.image, PIXEL[name] ?? SPRITE_PIXEL),
    )),
  ])

  const sheet = pack(frames)

  await run([
    '-size', `${sheet.width}x${sheet.height}`, 'xc:none',
    ...sheet.frames.flatMap(frame => [frame.path, '-geometry', `+${frame.x}+${frame.y}`, '-composite']),
    '-depth', '8',
    new URL('main.png', outDir).pathname,
  ])

  const json = {
    frames: Object.fromEntries(sheet.frames.map(({ name, x, y, w, h }) => [`${name}.png`, {
      frame: { x, y, w, h },
      rotated: false,
      trimmed: false,
      spriteSourceSize: { x: 0, y: 0, w, h },
      sourceSize: { w, h },
    }])),
    meta: {
      image: 'main.png',
      format: 'RGBA8888',
      size: { w: sheet.width, h: sheet.height },
      scale: '1',
    },
  }
  await Deno.writeTextFile(new URL('main.json', outDir), `${JSON.stringify(json, null, 2)}\n`)
  await Deno.remove(tmp, { recursive: true })
  console.log(`${sheet.frames.length} frames, ${sheet.width}x${sheet.height}`)
}

await main()
