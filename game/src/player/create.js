import * as R from 'ramda'
import * as l1 from 'l1'
import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js'

import state from '../state'
import playerRepository from './repository'
import addEntity from '../addEntity'
import { Colors } from '../../../common'

import {
  GAME_HEIGHT,
  DOME_X,
  DOME_Y,
} from '../constant'

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

const createBody = () => Matter.Bodies.circle(
  (DOME_X - GAME_HEIGHT / 2) + 20,
  400,
  15,
  { friction: 0 },
)

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

export default (pixiStage, matterWorld, id) => {
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
    const normalize = (v) => {
      const length = Math.sqrt((v.x ** 2) + (v.y ** 2))

      return {
        x: v.x / length,
        y: v.y / length,
      }
    }

    const rotate = (angle, v) => ({
      x: v.x * Math.cos(angle) - v.y * Math.sin(angle),
      y: v.x * Math.sin(angle) + v.y * Math.cos(angle),
    })

    const foo = {
      x: body.position.x - DOME_X,
      y: body.position.y - DOME_Y,
    }

    const velocityDirection = rotate(-Math.PI / 2.1, normalize(foo))

    // TODO: Decide how to handle this gravity
    // const FORCE_FACTOR = 200

    // const force = {
    //   x: normalize(foo).x / FORCE_FACTOR,
    //   y: normalize(foo).y / FORCE_FACTOR,
    // }

    Matter.Body.setVelocity(body, { x: velocityDirection.x * 2, y: velocityDirection.y * 2 })
    // Matter.Body.applyForce(body, { x: 0, y: 0 }, force)
  })

  addEntity(
    pixiStage,
    matterWorld,
    player,
  )
  playerRepository.add(player)

  return player
}
