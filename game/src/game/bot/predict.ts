import {
  add,
  length,
  rotate,
  subtract,
  type Vector,
} from '../linearAlgebra'
import {
  GRAVITY_STRENTH,
  MAX_JUMP_STRENGTH,
  TICKS_PER_SEC,
} from '../constant'

const AIR_DRAG = 0.99

const CENTRIFUGAL = 0.75

export const angularVelocity = (lapTime: number) => -(2 * Math.PI) / (lapTime * TICKS_PER_SEC)

export const polarAngle = (center: Vector, position: Vector) => {
  const { x, y } = subtract(center, position)
  return Math.atan2(y, x)
}

export const mod2Pi = (angle: number) => ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)

export const orbit = (center: Vector, position: Vector, angle: number) => add(
  center,
  rotate(angle, subtract(center, position)),
)

export const atRadius = (center: Vector, angle: number, radius: number) => add(
  center,
  { x: radius * Math.cos(angle), y: radius * Math.sin(angle) },
)

export const distance = (a: Vector, b: Vector) => length(subtract(a, b))

export const gapAhead = (center: Vector, direction: number, from: Vector, to: Vector) => mod2Pi(
  (polarAngle(center, to) - polarAngle(center, from)) * direction,
)

export const interceptAngle = ({
  center, from, target, targetAngularVelocity, speed, maxTicks,
}: {
  center: Vector
  from: Vector
  target: Vector
  targetAngularVelocity: number
  speed: number
  maxTicks: number
}) => {
  const tick = Array
    .from({ length: maxTicks }, (_, index) => index + 1)
    .find(t => distance(from, orbit(center, target, targetAngularVelocity * t)) <= speed * t)

  if (tick === undefined) return undefined

  const { x, y } = subtract(from, orbit(center, target, targetAngularVelocity * tick))
  return Math.atan2(y, x)
}

export const jumpRadii = (radius: number, jumpPower: number, ground: number, spin: number) => {
  const step = (
    path: number[],
    inward: number,
  ): number[] => {
    const current = path[path.length - 1]
    const velocity = (inward - GRAVITY_STRENTH - CENTRIFUGAL * current * spin ** 2) * AIR_DRAG
    const next = current - velocity
    return next >= ground || path.length > TICKS_PER_SEC * 5
      ? path
      : step([...path, next], velocity)
  }
  return step([radius], MAX_JUMP_STRENGTH * jumpPower).slice(1)
}
