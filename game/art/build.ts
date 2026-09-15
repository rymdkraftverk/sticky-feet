#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run=magick

const SCALE = 2
const PADDING = 2
const MAX_WIDTH = 2048

const LAYERED = ['astronaut-side-1', 'astronaut-side-2', 'astronaut-front-1', 'astronaut-front-2']
const LAYERS = ['rim', 'suit', 'gear']

const artDir = new URL('.', import.meta.url)
const outDir = new URL('../public/spritesheet/', import.meta.url)

const run = async (args: string[]) => {
  const { success, stderr } = await new Deno.Command('magick', { args }).output()
  if (!success) throw new Error(new TextDecoder().decode(stderr))
}

const hideOtherLayers = (svg: string, layer: string) => {
  const hidden = LAYERS.filter(other => other !== layer).map(other => `#${other}{display:none}`).join('')
  return svg.replace(/<svg\b[^>]*>/, tag => `${tag}<style>${hidden}</style>`)
}

const variants = (name: string, svg: string) => (
  LAYERED.includes(name)
    ? LAYERS.map(layer => ({ name: `${name}-${layer}`, svg: hideOtherLayers(svg, layer) }))
    : [{ name, svg }]
)

const size = (svg: string) => {
  const width = Number(svg.match(/<svg\b[^>]*\bwidth="(\d+)"/)?.[1])
  const height = Number(svg.match(/<svg\b[^>]*\bheight="(\d+)"/)?.[1])
  if (!width || !height) throw new Error('svg root needs integer width and height')
  return { w: width * SCALE, h: height * SCALE }
}

const rasterize = async (tmp: string, { name, svg }: { name: string, svg: string }) => {
  const svgPath = `${tmp}/${name}.svg`
  const pngPath = `${tmp}/${name}.png`
  await Deno.writeTextFile(svgPath, svg)
  await run(['-background', 'none', '-density', String(96 * SCALE), svgPath, pngPath])
  return { name, path: pngPath, ...size(svg) }
}

type Frame = { name: string, path: string, w: number, h: number }

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
    .filter(entry => entry.name.endsWith('.svg'))
    .map(entry => entry.name.replace(/\.svg$/, ''))
    .sort()

  const frames = await Promise.all(sources.flatMap(name => (
    variants(name, Deno.readTextFileSync(new URL(`${name}.svg`, artDir)))
      .map(variant => rasterize(tmp, variant))
  )))

  const sheet = pack(frames)

  await run([
    '-size', `${sheet.width}x${sheet.height}`, 'xc:none',
    ...sheet.frames.flatMap(frame => [frame.path, '-geometry', `+${frame.x}+${frame.y}`, '-composite']),
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
      scale: String(SCALE),
    },
  }
  await Deno.writeTextFile(new URL('main.json', outDir), `${JSON.stringify(json, null, 2)}\n`)
  await Deno.remove(tmp, { recursive: true })
  console.log(`${sheet.frames.length} frames, ${sheet.width}x${sheet.height}`)
}

await main()
