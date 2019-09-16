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
  DEFAULT_LAP_TIME,
  TICKS_PER_SEC,
  SLOW_FACTOR,
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

const lapTime = (slows, breaking) => {
  const correctedForSlow = DEFAULT_LAP_TIME * (SLOW_FACTOR ** slows)
  return breaking ? correctedForSlow + DEFAULT_LAP_TIME : correctedForSlow
}

export default (id) => {
  const player = playerRepository.find(id)
  const { body } = player

  const b = l1.repeat(() => {
    body.velocity = enforceRunning(
      DOME_CENTER,
      lapTime(player.slows, player.breaking),
      body.position,
      body.velocity,
    )
  })

  b.id = `autorun_${id}`
  return b.id
}
