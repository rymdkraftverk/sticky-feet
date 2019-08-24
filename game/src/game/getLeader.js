import {
  DOME_X,
  DOME_Y,
} from './constant'

import {
  subtract,
} from './linearAlgebra'

const DOME_CENTER = { x: DOME_X, y: DOME_Y }

const getAngle = (p) => {
  const { x: dx, y: dy } = subtract(p, DOME_CENTER)

  return Math.atan2(dx, dy)
}

const getLeader = (p1, p2) => {
  const angle1 = getAngle(p1)
  const angle2 = getAngle(p2)

  const angleDiff = getAngle(p2) - getAngle(p1)
  const differentAngleSign = (angle1 * angle2) < 0

  if (differentAngleSign) {
    return angleDiff > Math.PI
      ? p2
      : p1
  }

  return angleDiff > 0 && angleDiff < Math.PI
    ? p1
    : p2
}

export default getLeader
