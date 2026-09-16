import {
  DOME_CENTER,
  DEFAULT_LAP_TIME,
} from '../src/game/constant'

import {
  add,
  rotate,
} from '../src/game/linearAlgebra'

import getLeader from '../src/game/getLeader'

const radius = 10

const generateNearbyPair = (angle: number) => ({
  leader: add(
    DOME_CENTER,
    rotate(angle - 0.1, { x: radius, y: 0 }),
  ),
  behind: add(
    DOME_CENTER,
    rotate(angle + 0.1, { x: radius, y: 0 }),
  ),
})

const ANGLES = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 4]

test.each(ANGLES)('leader at %f radians', (angle) => {
  const { leader, behind } = generateNearbyPair(angle)

  expect(getLeader(DEFAULT_LAP_TIME, leader, behind))
    .toEqual(leader)

  expect(getLeader(DEFAULT_LAP_TIME, behind, leader))
    .toEqual(leader)
})

test.each(ANGLES)('reversed leader at %f radians', (angle) => {
  const { leader, behind } = generateNearbyPair(angle)

  expect(getLeader(-DEFAULT_LAP_TIME, leader, behind))
    .toEqual(behind)

  expect(getLeader(-DEFAULT_LAP_TIME, behind, leader))
    .toEqual(behind)
})
