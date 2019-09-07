import * as PIXI from 'pixi.js'
import * as l1 from 'l1'
import * as Matter from 'matter-js'

import * as entity from '../entity'
import projectileRepository from './repository'

const move = (id) => {
  const {
    sprite: { rotation: angle },
    body,
  } = projectileRepository.find(id)

  const b = l1.repeat(() => {
    Matter.Body.setVelocity(body, {
      x: 4 * Math.cos(angle),
      y: 4 * Math.sin(angle),
    })
  })
  b.id = `projectile_move_${id}`
  return b.id
}

export default ({
  angle, player: { body, id: playerId },
}) => {
  const originX = body.position.x
  const originY = body.position.y

  // @ts-ignore
  const projectileSprite = new PIXI.AnimatedSprite(['fireball1', 'fireball2'].map(l1.getTexture))
  projectileSprite.scale.set(3)
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
  }
}
