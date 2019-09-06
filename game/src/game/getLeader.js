import {
  DOME_CENTER,
} from './constant'

import {
  subtract,
} from './linearAlgebra'

const getAngle = (p) => {
  const { x: dx, y: dy } = subtract(DOME_CENTER, p)

  return Math.atan2(dx, dy)
}

const modulus = (a, b) => (b + a) % a

/*
 * Y-axis goes from top to bottom and X-axis from left to right, so the angle
 * of the polar coordinates will increase clockwise.
 *
 * The lizards run counter clockwise, so a greater angle means you're behind.
 */
const getLeader = (p1, p2) => {
  const angleDiff = modulus(
    2 * Math.PI,
    getAngle(p2) - getAngle(p1),
  )

  // angle(p1) + anglediff (mod 2PI) = angle(p2) (mod 2PI)
  return angleDiff < Math.PI
    ? p2
    : p1
}

export default getLeader
