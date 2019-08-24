import {
  DOME_X,
  DOME_Y,
} from '../src/game/constant'

import {
  add,
  rotate,
} from '../src/game/linearAlgebra'

import getLeader from '../src/game/getLeader'

const DOME_CENTER = { x: DOME_X, y: DOME_Y }
const radius = 10

const generateNearbyPair = angle => ({
  p1: add(DOME_CENTER, rotate(angle + 0.1, { x: radius, y: 0 })),
  p2: add(DOME_CENTER, rotate(angle - 0.1, { x: radius, y: 0 })),
})

test('0 radians', () => {
  const { p1, p2 } = generateNearbyPair(0)

  expect(getLeader(p1, p2))
    .toEqual(p1)

  expect(getLeader(p2, p1))
    .toEqual(p1)
})

test('Pi / 2 radians', () => {
  const { p1, p2 } = generateNearbyPair(Math.PI / 2)

  expect(getLeader(p1, p2))
    .toEqual(p1)

  expect(getLeader(p2, p1))
    .toEqual(p1)
})

// --- Read ---
test('Pi radians', () => {
  const { p1, p2 } = generateNearbyPair(Math.PI)

  expect(getLeader(p1, p2))
    .toEqual(p1)

  expect(getLeader(p2, p1))
    .toEqual(p1)
})

test('3 Pi / 4 radians', () => {
  const { p1, p2 } = generateNearbyPair(3 * Math.PI / 4)

  expect(getLeader(p1, p2))
    .toEqual(p1)

  expect(getLeader(p2, p1))
    .toEqual(p1)
})

/*
test('find', () => {
  expect(repo.find('foo'))
    .toEqual(PLAYERS[0])
})

// --- Write ---

test('add', () => {
  repo.add({
    id: 'unique',
    color: 'yellow',
  })

  expect(state.players)
    .toEqual(PLAYERS.concat({
      id: 'unique',
      color: 'yellow',
    }))
})

test('remove', () => {
  repo.remove('bar')

  expect(state.players)
    .toEqual([{
      id: 'foo',
      color: 'blue',
    }])
})
*/
