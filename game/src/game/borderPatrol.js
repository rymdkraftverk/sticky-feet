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

  const positionDirection = normalize(relativePosition)

  const outwardVelocity = scale(
    dotProduct(velocity, positionDirection),
    positionDirection,
  )

  const updatedVelocity = subtract(
    outwardVelocity,
    velocity,
  )

  return {
    position: updatedPosition,
    velocity: updatedVelocity,
  }
}

const borderPatrol = (id) => {
  const { body } = playerRepository.find(id)

  const b = l1.repeat(() => {
    const { position, velocity } = enforceBorder(RADIUS, DOME_CENTER, body)

    Matter.Body.setVelocity(body, velocity)
    Matter.Body.setPosition(body, position)
  })

  b.id = `autorun_${id}`
  return b.id
}

export default borderPatrol
