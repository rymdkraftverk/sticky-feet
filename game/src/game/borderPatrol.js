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

const RADIUS = DOME_Y * 0.95

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
    return {
      position,
      velocity,
      grounded: false,
    }
  }

  const updatedPosition = add(
    center,
    scale(radius / positionDistance, relativePosition),
  )

  return {
    position: updatedPosition,
    velocity: enforceVelocity(relativePosition, velocity),
    grounded: true,
  }
}

const borderPatrol = (id) => {
  const player = playerRepository.find(id)
  const { body } = player

  const b = l1.repeat(() => {
    const {
      position,
      velocity,
      grounded,
    } = enforceBorder(RADIUS, DOME_CENTER, body)

    Matter.Body.setVelocity(body, velocity)
    Matter.Body.setPosition(body, position)
    player.grounded = grounded
  })

  b.id = `border_patrol_${id}`
  return b.id
}

export default borderPatrol
