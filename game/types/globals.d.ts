declare namespace NodeJS {
  interface ProcessEnv {
    CONTROLLER_HOST?: string
    HTTP_ADDRESS?: string
    VERSION?: string
    WS_ADDRESS?: string
  }
}

declare const process: { env: NodeJS.ProcessEnv }

interface Window {
  debug: Record<string, unknown>
  decomp: unknown
}
