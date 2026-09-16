import * as l2 from 'l2'
import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js'
import { Colors } from 'common'

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
import scaleSprite, { UPRIGHT } from '../scaleSprite'
import createFigure, { type Figure } from './figure'
import type { Player } from '../types'

const RUN_ANIMATION_SPEED = 0.08
const FEET_Y = 18

export const BODY_RADIUS = 15

const findColor = (name: string) => {
  const color = Colors.find(c => c.name === name)
  if (!color) {
    throw new Error(`No colour named ${name}`)
  }
  return color
}

const createBody = () => {
  const { x, y } = spawnPosition()
  const body = Matter.Bodies.circle(
    x,
    y,
    BODY_RADIUS,
    { friction: 0 },
  )
  body.entityType = 'player'
  return body
}

const createSprite = (figure: Figure, hex: string) => {
  const figureSprite = createFigure(figure, 'side', hex, RUN_ANIMATION_SPEED)
  figureSprite.position.set(-figureSprite.width / 2, FEET_Y - figureSprite.height)

  const splat = new PIXI.Sprite(l2.getTexture('splat'))
  splat.anchor.set(0.5, 1)
  splat.y = FEET_Y + 4
  splat.visible = false

  const sprite = new PIXI.Container()
  scaleSprite(sprite, UPRIGHT)
  sprite.addChild(figureSprite, splat)

  return { sprite, splat }
}

export default (id: string, figure: Figure) => {
  const colorName = state.availableColors.pop()
  if (!colorName) {
    throw new Error('No colours left to hand out')
  }
  const color = findColor(colorName)
  const { sprite, splat } = createSprite(figure, color.hex)
  const body = createBody()

  const player: Player = {
    behaviors: {},
    id,
    color,
    scope: scope.create(),
    sprite,
    splat,
    body,
    slows: 0,
    score: 0,
    jumpPower: 0,
    braking: false,
    cooldowns: {},
    figure,
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
