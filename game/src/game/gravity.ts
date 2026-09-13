import * as Matter from 'matter-js'
import * as l2 from 'l2'
import playerRepository from './player/repository'
import {
  add,
  subtract,
  normalize,
  scale,
  type Vector,
} from './linearAlgebra'

import {
  DOME_CENTER,
  GRAVITY_STRENTH,
} from './constant'

const updateVelocity = (position: Vector, velocity: Vector) => {
  const gravityDirection = normalize(subtract(DOME_CENTER, position))
  const gravity = scale(GRAVITY_STRENTH, gravityDirection)

  const newVelocity = add(gravity, velocity)
  return newVelocity
}

const attachGravity = (id: string) => {
  const { body } = playerRepository.find(id)
  const behaviorId = `gravity_${id}`

  l2.repeat(() => {
    const updatedVelocity = updateVelocity(body.position, body.velocity)

    Matter.Body.setVelocity(body, updatedVelocity)
  }, 1, { id: behaviorId })
  return behaviorId
}

export default attachGravity
