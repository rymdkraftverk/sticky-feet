import * as PIXI from 'pixi.js'
import * as ex from '../pixiEx'

import state from './state'

const CROWN_NAME = 'leader crown'

const placeCrownOnSprite = (playerSprite: PIXI.AnimatedSprite) => {
  const crown = new PIXI.Sprite(ex.getTexture('crown'))
  crown.scale.set(1 / 5)
  crown.x -= crown.width / 1
  crown.y -= crown.height * 2
  crown.name = CROWN_NAME

  playerSprite.addChild(crown)
}

const clearCrownFromSprite = (playerSprite: PIXI.AnimatedSprite) => playerSprite
  .children
  .filter(sprite => sprite.name === CROWN_NAME)
  .forEach(sprite => playerSprite.removeChild(sprite))

const assignCrown = () => {
  const [leader, ...nonLeaders] = state
    .players
    .slice()
    .sort((a, b) => b.score - a.score)
    .map(({ sprite }) => sprite)

  if (!leader) {
    return
  }

  placeCrownOnSprite(leader)
  nonLeaders.forEach(clearCrownFromSprite)
}

export default assignCrown
