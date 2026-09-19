import * as Matter from 'matter-js'
import * as l2 from 'l2'

import state from '../src/game/state'
import removePlayer from '../src/game/player/remove'
import shake from '../src/game/shake'
import slow from '../src/game/slow'
import { SLOW_DURATION } from '../src/game/constant'
import type { Player } from '../src/game/types'

const leaver = () => ({
  id: 'leaver',
  body: Matter.Bodies.circle(0, 0, 10),
  behaviors: { pointAtMiddleId: 'point_at_middle_leaver' },
  color: { name: 'blue', hex: '#0000ff' },
  scope: { destroy: () => {} },
  slows: 0,
  splat: { visible: false },
  sprite: { destroy: () => {}, rotation: 0, position: { x: 0, y: 0 } },
}) as unknown as Player

const tick = (times: number) => {
  Array.from({ length: times }).forEach(() => l2.update(1))
}

beforeEach(() => {
  state.matterWorld = Matter.Engine.create().world
  state.players = [leaver()]
})

test('a slow ending after its player left does nothing', () => {
  slow('leaver')
  removePlayer('leaver')

  expect(() => tick(SLOW_DURATION)).not.toThrow()
})

test('a shake ending after its player left does nothing', () => {
  shake('leaver')
  removePlayer('leaver')

  expect(() => tick(SLOW_DURATION)).not.toThrow()
})
