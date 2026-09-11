import { DOME_CENTER } from '../constant'
import * as LA from '../linearAlgebra'
import playerRepository from './repository'
import type { Player } from '../types'

const DISTANCE_FROM_MIDDLE = 1

const getAngle = ({ body: { position } }: Player) => {
  const { x: dx, y: dy } = LA.subtract(DOME_CENTER, position)

  return Math.atan2(dx, dy)
}

const mod2Pi = (x: number) => (2 * Math.PI + x) % (2 * Math.PI)

const placeAheadOfPosition = (angle: number, position: LA.Vector) => LA.add(
  DOME_CENTER,
  LA.scale(
    DISTANCE_FROM_MIDDLE,
    LA.normalize(LA.rotate(angle, LA.subtract(DOME_CENTER, position))),
  ),
)

/*
 * The idea is to find all the gaps between players, then take the largets one
 * and place the new player right in the middle of that gap.
 *
 * This is obviously nonsensical if there are no players. A default position is
 * then used.
 *
 * If there is only one player then the distance between that player and the
 * 'next' player will be zero. Which is also a bit tricky to work with. If that
 * is the case then the new player will be placed at the opposite end as the
 * existing player.
 */

export default () => {
  const players = playerRepository.all()

  if (players.length === 0) {
    return LA.add(DOME_CENTER, { x: 0, y: DISTANCE_FROM_MIDDLE })
  }

  if (players.length === 1) {
    return placeAheadOfPosition(
      Math.PI,
      players[0].body.position,
    )
  }

  const sortedPlayers = players.slice().sort((a, b) => getAngle(a) - getAngle(b))
  const anglePositions = sortedPlayers.map(getAngle)
  const shifted = [anglePositions[anglePositions.length - 1], ...anglePositions]

  const gaps = anglePositions
    .map((angle, index) => angle - shifted[index])
    .map(mod2Pi)

  const greatestGap = gaps.reduce((a, b) => Math.max(a, b), 0)

  const { body: { position } } = sortedPlayers[gaps.indexOf(greatestGap)]

  return placeAheadOfPosition(
    greatestGap / 2,
    position,
  )
}
