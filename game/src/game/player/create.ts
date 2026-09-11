import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js'
import { Colors } from 'common'
import * as ex from '../../pixiEx'

import state from '../state'
import playerRepository from './repository'
import spawnPosition from './spawnPosition'
import * as entity from '../entity'
import autorun from '../autorun'
import gravity from '../gravity'
import scope from '../scope'
import borderPatrol from '../borderPatrol'
import pointAtMiddle from '../pointAtMiddle'
import scopeFollowsPlayer from '../scopeFollowsPlayer'
import { DEFAULT_PLAYER_SPRITE_SCALE } from '../constant'
import type { Player } from '../types'

const COLOR_COUNT = Colors.length

const INDEX_COLOR_MAPPING: Record<string, number> = Object.fromEntries(
  Colors.map(({ name }, index) => [name, index]),
)

const findColor = (name: string) => {
  const color = Colors.find(c => c.name === name)
  if (!color) {
    throw new Error(`No colour named ${name}`)
  }
  return color
}

const SIDE_1 = 0
const SIDE_2 = 1
const FRONT_STRETCHED = 2
const FRONT_COLLAPSED = 3

const createAnimation = (colorName: string, texture1: number, texture2: number) => {
  const colorIndex = INDEX_COLOR_MAPPING[colorName]
  return [
    `lizard-${colorIndex + (COLOR_COUNT * texture1)}`,
    `lizard-${colorIndex + (COLOR_COUNT * texture2)}`,
  ].map(ex.getTexture)
}

export const createFrontAnimation = (colorName: string) => (
  createAnimation(colorName, FRONT_COLLAPSED, FRONT_STRETCHED)
)

export const createSideAnimation = (colorName: string) => createAnimation(colorName, SIDE_1, SIDE_2)

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

const createSprite = (colorName: string) => {
  const sprite = new PIXI.AnimatedSprite(
    createSideAnimation(colorName),
  )
  sprite.scale.set(DEFAULT_PLAYER_SPRITE_SCALE)
  sprite.anchor.set(0.5)
  sprite.animationSpeed = 0.08
  sprite.play()

  return sprite
}

export default (id: string) => {
  const colorName = state.availableColors.pop()
  if (!colorName) {
    throw new Error('No colours left to hand out')
  }
  const color = findColor(colorName)
  const sprite = createSprite(colorName)
  const body = createBody()

  const player: Player = {
    behaviors: {},
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
    grounded: false,
  }

  entity.add(player)
  playerRepository.add(player)

  player.behaviors = {
    autorunId: autorun(id),
    scopeFollowsPlayerId: scopeFollowsPlayer(id),
    gravityId: gravity(id),
    borderPatrolId: borderPatrol(id),
    pointAtMiddleId: pointAtMiddle(id),
  }

  return player
}
