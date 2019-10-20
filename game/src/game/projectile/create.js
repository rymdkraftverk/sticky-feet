import * as PIXI from 'pixi.js'
import * as l1 from 'l1'
import * as ex from 'pixi-ex'
import * as Matter from 'matter-js'

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

import { subtract } from '../linearAlgebra'

const exceedsBorder = (position) => {
  const { x, y } = subtract(position, DOME_CENTER)

  return Math.abs(x) > GAME_WIDTH / 2
    || Math.abs(y) > GAME_HEIGHT / 2
}

const borderPatrolBehavior = (id) => {
  const projectile = projectileRepository.find(id)
  const { body: { position } } = projectile

  const b = l1.repeat(() => {
    if (exceedsBorder(position)) {
      removeProjectile(id)
    }
  })

  b.id = `projectile_border_patrol_${id}`
  return b.id
}

const move = (id) => {
  const {
    sprite: { rotation: angle },
    body,
  } = projectileRepository.find(id)

  const b = l1.repeat(() => {
    Matter.Body.setVelocity(body, {
      x: Math.sqrt(2) * PROJECTILE_SPEED * Math.cos(angle),
      y: Math.sqrt(2) * PROJECTILE_SPEED * Math.sin(angle),
    })
  })
  b.id = `projectile_move_${id}`
  return b.id
}

export default (id, { angle }) => {
  const {
    body,
    id: playerId,
  } = playerRepository.find(id)

  const originX = body.position.x
  const originY = body.position.y

  // TODO: Look into why this throws type error
  // @ts-ignore
  const projectileSprite = new PIXI.AnimatedSprite(['fireball1', 'fireball2'].map(ex.getTexture))
  projectileSprite.scale.set(3)
  projectileSprite.anchor.set(0.5)
  projectileSprite.animationSpeed = 0.1
  projectileSprite.play()
  projectileSprite.rotation = angle
  projectileSprite.position = { x: originX, y: originY }

  const projectileBody = Matter.Bodies.circle(originX, originY, 10, {
    isSensor: true,
  })
  projectileBody.entityType = 'projectile'

  const projectile = {
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
