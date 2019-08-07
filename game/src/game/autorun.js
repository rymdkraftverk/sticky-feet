import * as Matter from 'matter-js'
import * as l1 from 'l1'
import playerRepository from './player/repository'

import {
  DOME_X,
  DOME_Y,
} from './constant'

export default (id) => {
  const { body } = playerRepository.find(id)

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
}
