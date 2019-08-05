import * as R from 'ramda'
import * as l1 from 'l1'
import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js'

import state from '../state'
import playerRepository from './repository'
import addEntity from '../addEntity'
import { Colors } from '../../../common'

const COLOR_COUNT = 12

const INDEX_COLOR_MAPPING = R.mergeAll(
  R.addIndex(R.map)(
    (x, i) => ({ [x.name]: i }),
    Colors,
  ),
)

const FRONT_COLLAPSED = 2
const FRONT_STRETCHED = 3

const createSpriteAnimation = (colorName) => {
  const colorIndex = INDEX_COLOR_MAPPING[colorName]
  return R.map(
    l1.getTexture,
    [
      `lizard-${colorIndex + (COLOR_COUNT * FRONT_COLLAPSED)}`,
      `lizard-${colorIndex + (COLOR_COUNT * FRONT_STRETCHED)}`,
    ],
  )
}

const createBody = () => Matter.Bodies.circle(700, 400, 15, 15)

const createSprite = (colorName) => {
  const sprite = new PIXI.AnimatedSprite(
    createSpriteAnimation(colorName),
  )
  sprite.scale.set(2)
  sprite.anchor.set(0.5)
  sprite.animationSpeed = 0.02
  sprite.play()
  return sprite
}

export default (pixiStage, matterEngine, id) => {
  const colorName = state.availableColors.pop()
  const sprite = createSprite(colorName)
  const body = createBody()

  const player = {
    id,
    color: colorName,
    sprite,
    body,
  }

  l1.repeat(() => {
    Matter.Body.setVelocity(body, { x: 1, y: 0 })
  })

  addEntity(
    pixiStage,
    matterEngine,
    player,
  )
  playerRepository.add(player)

  return player
}
