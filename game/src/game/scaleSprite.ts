import type * as PIXI from 'pixi.js'

import state from './state'

const facing = () => Math.sign(state.lapTime)

const scaleSprite = (sprite: PIXI.Container, scale: number) => {
  sprite.scale.set(scale * facing(), scale)
}

export default scaleSprite
