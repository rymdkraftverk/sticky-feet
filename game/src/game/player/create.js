import * as R from 'ramda'
import * as l1 from 'l1'
import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js'

import state from '../state'
import playerRepository from './repository'
import * as entity from '../entity'
import autorun from '../autorun'
import gravity from '../gravity'
import scope from '../scope'
import { Colors } from '../../../../common'
import borderPatrol from '../borderPatrol'
import pointAtMiddle from '../pointAtMiddle'

import {
  GAME_HEIGHT,
  DOME_X,
} from '../constant'

const COLOR_COUNT = Colors.length

const INDEX_COLOR_MAPPING = R.mergeAll(
  R.addIndex(R.map)(
    (x, i) => ({ [x.name]: i }),
    Colors,
  ),
)

const findColor = name => R.find(
  R.propEq('name', name),
  Colors,
)

const FRONT_COLLAPSED = 0
const FRONT_STRETCHED = 1

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

const createBody = () => {
  const body = Matter.Bodies.circle(
    (DOME_X - GAME_HEIGHT / 2) + 20,
    400,
    15,
    { friction: 0 },
  )
  body.entityType = 'player'
  return body
}

const createSprite = (colorName) => {
  const sprite = new PIXI.AnimatedSprite(
    createSpriteAnimation(colorName),
  )
  sprite.scale.set(2)
  sprite.anchor.set(0.5)
  sprite.animationSpeed = 0.08
  sprite.play()
  return sprite
}

export default (id) => {
  const colorName = state.availableColors.pop()
  const color = findColor(colorName)
  const sprite = createSprite(colorName)
  const body = createBody()

  const player = {
    id,
    color,
    scope: scope.create(),
    sprite,
    body,
    speed: 1,
  }

  entity.add(player)
  playerRepository.add(player)

  player.autorunId = autorun(id)
  player.gravityId = gravity(id)
  player.borderPatrolId = borderPatrol(id)
  player.pointAtMiddleId = pointAtMiddle(id)

  return player
}
