import { defineConfig } from 'vite'

const inlined = [
  'CONTROLLER_HOST',
  'HTTP_ADDRESS',
  'VERSION',
  'WS_ADDRESS',
]

export default defineConfig({
  base: './',
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
  preview: {
    port: 8081,
    strictPort: true,
    host: true,
  },
})
