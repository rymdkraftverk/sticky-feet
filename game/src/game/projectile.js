import * as PIXI from 'pixi.js'
import * as l1 from 'l1'
import * as Matter from 'matter-js'

import { add } from './entity'

const create = ({
  angle, player: { body },
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

  l1.repeat(() => {
    Matter.Body.setVelocity(projectileBody, {
      x: 4 * Math.cos(angle),
      y: 4 * Math.sin(angle),
    })
  })

  add({
    id: `projectile-${Math.random()}`,
    sprite: projectileSprite,
    body: projectileBody,
  })
}

export default {
  create,
}
