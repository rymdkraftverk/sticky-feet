import * as l2 from 'l2'
import * as PIXI from 'pixi.js'

import state from './state'

const CROWN_NAME = 'leader crown'

const CROWN_Y = 32

const placeCrownOnSprite = (playerSprite: PIXI.Container) => {
  const crown = new PIXI.Sprite(l2.getTexture('crown'))
  crown.anchor.set(0.5, 1)
  crown.rotation = Math.PI
  crown.y = CROWN_Y
  crown.label = CROWN_NAME

  playerSprite.addChild(crown)
}

const clearCrownFromSprite = (playerSprite: PIXI.Container) => playerSprite
  .children
  .filter(sprite => sprite.label === CROWN_NAME)
  .forEach(sprite => playerSprite.removeChild(sprite))

const assignCrown = () => {
  const sprites = state
    .players
    .slice()
    .sort((a, b) => b.score - a.score)
    .map(({ sprite }) => sprite)

  const [leader] = sprites

  if (!leader) {
    return
  }

  sprites.forEach(clearCrownFromSprite)
  placeCrownOnSprite(leader)
}

export default assignCrown
