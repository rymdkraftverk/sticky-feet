import * as R from 'ramda'

import { DOME_CENTER } from '../constant'
import * as LA from '../linearAlgebra'
import playerRepository from './repository'

const DISTANCE_FROM_MIDDLE = 1

const getAngle = ({ body: { position } }) => {
  const { x: dx, y: dy } = LA.subtract(DOME_CENTER, position)

  return Math.atan2(dx, dy)
}

const mod2Pi = x => (2 * Math.PI + x) % (2 * Math.PI)

// (angle, Vector) -> Vector
const placeAheadOfPosition = (angle, position) => R.pipe(
  R.curry(LA.subtract)(DOME_CENTER),
  R.curry(LA.rotate)(angle),
  LA.normalize,
  R.curry(LA.scale)(DISTANCE_FROM_MIDDLE),
  R.curry(LA.add)(DOME_CENTER),
)(position)

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

  const sortedPlayers = R.sortBy(getAngle, players)
  const anglePositions = R.map(getAngle, sortedPlayers)
  const shifted = R.prepend(R.last(anglePositions), anglePositions)

  const gaps = R.zipWith(
    R.subtract,
    anglePositions,
    shifted,
  ).map(mod2Pi)

  const greatestGap = R.reduce(R.max, 0, gaps)

  const { body: { position } } = sortedPlayers[R.indexOf(greatestGap, gaps)]

  return placeAheadOfPosition(
    greatestGap / 2,
    position,
  )
}
