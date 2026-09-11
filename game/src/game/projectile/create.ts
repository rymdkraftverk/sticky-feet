import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js'
import * as l1 from '../../l1'
import * as ex from '../../pixiEx'

import Sound from '../sound'
import * as entity from '../entity'
import removeProjectile from './remove'
import projectileRepository from './repository'
import playerRepository from '../player/repository'
import {
  DOME_CENTER,
  GAME_HEIGHT,
  GAME_WIDTH,
  PROJECTILE_SPEED,
} from '../constant'

import { subtract, type Vector } from '../linearAlgebra'
import type { Projectile } from '../types'

const exceedsBorder = (position: Vector) => {
  const { x, y } = subtract(position, DOME_CENTER)

  return Math.abs(x) > GAME_WIDTH / 2
    || Math.abs(y) > GAME_HEIGHT / 2
}

const borderPatrolBehavior = (id: string) => {
  const projectile = projectileRepository.find(id)
  const { body: { position } } = projectile

  const behaviorId = `projectile_border_patrol_${id}`

  const b = l1.repeat(() => {
    if (exceedsBorder(position)) {
      removeProjectile(id)
    }
  })

  b.id = behaviorId
  return behaviorId
}

const move = (id: string) => {
  const {
    sprite: { rotation: angle },
    body,
  } = projectileRepository.find(id)

  const behaviorId = `projectile_move_${id}`

  const b = l1.repeat(() => {
    Matter.Body.setVelocity(body, {
      x: Math.sqrt(2) * PROJECTILE_SPEED * Math.cos(angle),
      y: Math.sqrt(2) * PROJECTILE_SPEED * Math.sin(angle),
    })
  })
  b.id = behaviorId
  return behaviorId
}

export default (id: string, { angle }: { angle: number }) => {
  const {
    body,
    id: playerId,
  } = playerRepository.find(id)

  const originX = body.position.x
  const originY = body.position.y

  const projectileSprite = new PIXI.AnimatedSprite(['fireball1', 'fireball2'].map(ex.getTexture))
  projectileSprite.scale.set(3)
  projectileSprite.anchor.set(0.5)
  projectileSprite.animationSpeed = 0.1
  projectileSprite.play()
  projectileSprite.rotation = angle
  projectileSprite.position.set(originX, originY)

  const projectileBody = Matter.Bodies.circle(originX, originY, 10, {
    isSensor: true,
  })
  projectileBody.entityType = 'projectile'

  const projectile: Projectile = {
    behaviors: {},
    id: `projectile-${Math.random()}`,
    sprite: projectileSprite,
    body: projectileBody,
    firedBy: playerId,
  }

  entity.add(projectile)
  projectileRepository.add(projectile)

  projectile.behaviors = {
    moveId: move(projectile.id),
    projectileBorderPatrolId: borderPatrolBehavior(projectile.id),
  }

  Sound.PROJECTILE_SHOOT.play()
}
