import * as Matter from 'matter-js'
import * as l1 from 'l1'
import playerRepository from './player/repository'

import {
  rotate,
  normalize,
  subtract,
  scale,
  length,
} from './linearAlgebra'

import {
  DOME_CENTER,
} from './constant'

export default (id) => {
  const { body } = playerRepository.find(id)

  const b = l1.repeat(() => {
    const playerVector = subtract(DOME_CENTER, body.position)
    const velocityDirection = rotate(-Math.PI / 2, normalize(playerVector))

    // speed scales with distance from center to offset angular velocity benefit of jumping
    const velocity = scale(10 * length(playerVector) / 1280, velocityDirection)
    Matter.Body.setVelocity(body, velocity)
  })

  b.id = `autorun_${id}`
  return b.id
}
