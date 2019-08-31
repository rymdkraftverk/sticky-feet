import * as Matter from 'matter-js'
import * as l1 from 'l1'
import playerRepository from './player/repository'
import {
  add,
  subtract,
  normalize,
  scale,
} from './linearAlgebra'

import {
  DOME_CENTER,
  GRAVITY_STRENTH,
} from './constant'

const updateVelocity = (position, velocity) => {
  const gravityDirection = normalize(subtract(DOME_CENTER, position))
  const gravity = scale(GRAVITY_STRENTH, gravityDirection)

  const newVelocity = add(gravity, velocity)
  return newVelocity
}

const attachGravity = (id) => {
  const { body } = playerRepository.find(id)

  const b = l1.repeat(() => {
    const updatedVelocity = updateVelocity(body.position, body.velocity)

    Matter.Body.setVelocity(body, updatedVelocity)
  })

  b.id = `gravity_${id}`
  return b.id
}

export default attachGravity
