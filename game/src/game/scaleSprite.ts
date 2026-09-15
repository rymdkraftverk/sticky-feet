import type * as PIXI from 'pixi.js'

import state from './state'

export type Squash = { x: number, y: number }

export const UPRIGHT: Squash = { x: 1, y: 1 }

const facing = () => Math.sign(state.lapTime)

const scaleSprite = (sprite: PIXI.Container, { x, y }: Squash) => {
  sprite.scale.set(x * facing(), y)
}

export default scaleSprite
