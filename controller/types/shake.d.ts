declare module 'shake.js' {
  export default class Shake {
    constructor(options?: { threshold?: number; timeout?: number })

    start(): void

    stop(): void
  }
}
