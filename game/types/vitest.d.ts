import 'vitest'

declare module 'vitest' {
  interface Assertion<T = unknown> {
    toMatchCloseTo(expected: unknown, decimals?: number): T
  }
}
