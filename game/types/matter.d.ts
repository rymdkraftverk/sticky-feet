import 'matter-js'

declare module 'matter-js' {
  interface Body {
    entityType?: 'player' | 'projectile'
  }
}
