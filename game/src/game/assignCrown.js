import * as l1 from 'l1'
import * as PIXI from 'pixi.js'
import * as R from 'ramda'

import state from './state'

const CROWN_NAME = 'leader crown'

const placeCrownOnSprite = (playerSprite) => {
  const crown = new PIXI.Sprite(l1.getTexture('crown'))
  crown.scale.set(1 / 5)
  crown.x -= crown.width / 1
  crown.y -= crown.height * 2
  crown.name = CROWN_NAME

  playerSprite.addChild(crown)
}

const clearCrownFromSprite = playerSprite => playerSprite
  .children
  .filter(R.propEq('name', CROWN_NAME))
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
