import * as R from 'ramda'
import * as l1 from 'l1'
import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js'

import state from '../state'
import playerRepository from './repository'
import spawnPosition from './spawnPosition'
import * as entity from '../entity'
import autorun from '../autorun'
import gravity from '../gravity'
import scope from '../scope'
import { Colors } from '../../../../common'
import borderPatrol from '../borderPatrol'
import pointAtMiddle from '../pointAtMiddle'
import { DEFAULT_PLAYER_SPRITE_SCALE } from '../constant'

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

const SIDE_1 = 0
const SIDE_2 = 1
const FRONT_STRETCHED = 2
const FRONT_COLLAPSED = 3

const createAnimation = (colorName, texture1, texture2) => {
  const colorIndex = INDEX_COLOR_MAPPING[colorName]
  return R.map(
    l1.getTexture,
    [
      `lizard-${colorIndex + (COLOR_COUNT * texture1)}`,
      `lizard-${colorIndex + (COLOR_COUNT * texture2)}`,
    ],
  )
}

export const createFrontAnimation = colorName => createAnimation(
  colorName, FRONT_COLLAPSED, FRONT_STRETCHED,
)

export const createSideAnimation = colorName => createAnimation(
  colorName, SIDE_1, SIDE_2,
)

const createBody = () => {
  const { x, y } = spawnPosition()
  const body = Matter.Bodies.circle(
    x,
    y,
    15,
    { friction: 0 },
  )
  body.entityType = 'player'
  return body
}

const createSprite = (colorName) => {
  const sprite = new PIXI.AnimatedSprite(
    createSideAnimation(colorName),
  )
  sprite.scale.set(DEFAULT_PLAYER_SPRITE_SCALE)
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
    slows: 0,
    score: 0,
    jumpPower: 0,
    braking: false,
    cooldowns: {},
  }

  entity.add(player)
  playerRepository.add(player)

  player.behaviors = {
    autorunId: autorun(id),
    gravityId: gravity(id),
    borderPatrolId: borderPatrol(id),
    pointAtMiddleId: pointAtMiddle(id),
  }

  return player
}
