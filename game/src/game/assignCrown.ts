import * as PIXI from 'pixi.js'
import * as ex from '../pixiEx'

import state from './state'

const CROWN_NAME = 'leader crown'

const placeCrownOnSprite = (playerSprite: PIXI.Container) => {
  const crown = new PIXI.Sprite(ex.getTexture('crown'))
  crown.scale.set(1 / 5)
  crown.x -= crown.width / 1
  crown.y -= crown.height * 2
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
