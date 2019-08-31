import * as l1 from 'l1'
import * as Matter from 'matter-js'

import playerRepository from './player/repository'
import { DOME_Y, DOME_CENTER } from './constant'
import {
  add,
  dotProduct,
  subtract,
  length,
  normalize,
  scale,
} from './linearAlgebra'

const RADIUS = DOME_Y

const enforceVelocity = (relativePosition, velocity) => {
  const positionDirection = normalize(relativePosition)
  const velocityAlignment = dotProduct(velocity, positionDirection)

  // allow inward velocity
  if (velocityAlignment < 0) {
    return velocity
  }

  const outwardVelocity = scale(
    velocityAlignment,
    positionDirection,
  )

  return subtract(
    outwardVelocity,
    velocity,
  )
}

export const enforceBorder = (radius, center, { position, velocity }) => {
  const relativePosition = subtract(center, position)
  const positionDistance = length(relativePosition)

  if (positionDistance <= radius) {
    return { position, velocity }
  }

  const updatedPosition = add(
    center,
    scale(radius / positionDistance, relativePosition),
  )

  return {
    position: updatedPosition,
    velocity: enforceVelocity(relativePosition, velocity),
  }
}

const borderPatrol = (id) => {
  const { body } = playerRepository.find(id)

  const b = l1.repeat(() => {
    const { position, velocity } = enforceBorder(RADIUS, DOME_CENTER, body)

    Matter.Body.setVelocity(body, velocity)
    Matter.Body.setPosition(body, position)
  })

  b.id = `border_patrol_${id}`
  return b.id
}

export default borderPatrol
