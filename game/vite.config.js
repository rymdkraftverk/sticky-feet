import { defineConfig } from 'vite'

const inlined = [
  'CONTROLLER_HOST',
  'HTTP_ADDRESS',
  'VERSION',
  'WS_ADDRESS',
]

// l1 and pixi-ex ship Parcel bundles that assign `parcelRequire` as an implicit global,
// which throws in the strict-mode ES output
const PARCEL_BUNDLED_DEPS = /node_modules\/(l1|pixi-ex)\/dist\/index\.js$/

const parcelGlobal = {
  name:    'parcel-bundled-deps',
  enforce: 'pre',
  transform(code, id) {
    return PARCEL_BUNDLED_DEPS.test(id)
      ? code.replace(/(?<![.\w$])parcelRequire\s*=/g, 'globalThis.parcelRequire =')
      : null
  },
}

export default defineConfig({
  base:    './',
  plugins: [parcelGlobal],
  define: Object.fromEntries(
    inlined.map(key => [
      `process.env.${key}`,
      JSON.stringify(process.env[key] ?? null),
    ]),
  ),
  build: {
    assetsDir: 'bundle',
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
  server: {
    port: 8081,
    strictPort: true,
    host: true,
  },
})
