import {
  DOME_CENTER,
} from '../src/game/constant'

import {
  add,
  rotate,
} from '../src/game/linearAlgebra'

import getLeader from '../src/game/getLeader'

const radius = 10

const generateNearbyPair = angle => ({
  leader: add(
    DOME_CENTER,
    rotate(angle - 0.1, { x: radius, y: 0 }),
  ),
  behind: add(
    DOME_CENTER,
    rotate(angle + 0.1, { x: radius, y: 0 }),
  ),
})

test('0 radians', () => {
  const { leader, behind } = generateNearbyPair(0)

  expect(getLeader(leader, behind))
    .toEqual(leader)

  expect(getLeader(behind, leader))
    .toEqual(leader)
})

test('Pi / 2 radians', () => {
  const { leader, behind } = generateNearbyPair(Math.PI / 2)

  expect(getLeader(leader, behind))
    .toEqual(leader)

  expect(getLeader(behind, leader))
    .toEqual(leader)
})

test('Pi radians', () => {
  const { leader, behind } = generateNearbyPair(Math.PI)

  expect(getLeader(leader, behind))
    .toEqual(leader)

  expect(getLeader(behind, leader))
    .toEqual(leader)
})

test('3 Pi / 4 radians', () => {
  const { leader, behind } = generateNearbyPair(3 * Math.PI / 4)

  expect(getLeader(leader, behind))
    .toEqual(leader)

  expect(getLeader(behind, leader))
    .toEqual(leader)
})
