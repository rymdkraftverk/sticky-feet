import * as PIXI from 'pixi.js'
import * as R from 'ramda'
import * as ex from '../pixiEx'

import state from './state'

const CROWN_NAME = 'leader crown'

const placeCrownOnSprite = (playerSprite) => {
  const crown = new PIXI.Sprite(ex.getTexture('crown'))
  crown.scale.set(1 / 5)
  crown.x -= crown.width / 1
  crown.y -= crown.height * 2
  crown.name = CROWN_NAME

  playerSprite.addChild(crown)
}

const clearCrownFromSprite = playerSprite => playerSprite
  .children
  .filter(R.propEq(CROWN_NAME, 'name'))
  .forEach(sprite => playerSprite.removeChild(sprite))

const assignCrown = () => {
  const sprites = R.pipe(
    R.sortWith([R.descend(R.prop('score'))]),
    R.map(R.prop('sprite')),
  )(state.players)

  const leader = R.head(sprites)
  const nonLeaders = R.tail(sprites)

  placeCrownOnSprite(leader)
  R.forEach(clearCrownFromSprite, nonLeaders)
}

export default assignCrown
