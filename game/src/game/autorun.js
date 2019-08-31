import * as l1 from 'l1'
import playerRepository from './player/repository'

import {
  add,
  dotProduct,
  rotate,
  normalize,
  subtract,
  scale,
  length,
} from './linearAlgebra'

import {
  DOME_CENTER,
  LAP_TIME,
  TICKS_PER_SEC,
} from './constant'

const enforceRunning = (domeCenter, lapTime, position, velocity) => {
  const relativePosition = subtract(domeCenter, position)
  const radialDirection = rotate(-Math.PI / 2, normalize(relativePosition))

  // speed scales with distance from center to offset angular velocity benefit
  // of jumping
  const desiredSpeed = length(relativePosition)
    * (2 * Math.PI)
    / lapTime
    / TICKS_PER_SEC

  const radialVelocityAlignment = dotProduct(velocity, radialDirection)
  const correctionVelocity = scale(
    desiredSpeed - radialVelocityAlignment,
    radialDirection,
  )

  return add(correctionVelocity, velocity)
}

export default (id) => {
  const { body } = playerRepository.find(id)

  const b = l1.repeat(() => {
    body.velocity = enforceRunning(
      DOME_CENTER,
      LAP_TIME,
      body.position,
      body.velocity,
    )
  })

  b.id = `autorun_${id}`
  return b.id
}
