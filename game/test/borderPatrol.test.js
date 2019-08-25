import { toMatchCloseTo } from 'jest-matcher-deep-close-to'
import { enforceBorder } from '../src/game/borderPatrol'

expect.extend({ toMatchCloseTo })

const center = { x: 0, y: 0 }
const radius = 2

test('within boundary', () => {
  const body = {
    position: {
      x: 1,
      y: 1,
    },
    velocity: {
      x: 12,
      y: 34,
    },
  }

  expect(enforceBorder(radius, center, body))
    .toEqual(body)
})

test('outside boundary, no speed', () => {
  const velocity = {
    x: 0,
    y: 0,
  }

  const body = {
    position: {
      x: center.x + radius + 1,
      y: 0,
    },
    velocity,
  }

  expect(enforceBorder(radius, center, body))
    .toEqual({
      position: {
        x: center.x + radius,
        y: 0,
      },
      velocity,
    })
})

test('outside boundary, no speed', () => {
  const velocity = {
    x: 0,
    y: 0,
  }

  const body = {
    position: {
      x: center.x + Math.sqrt(1 / 2) * radius + 1,
      y: center.y + Math.sqrt(1 / 2) * radius + 1,
    },
    velocity,
  }

  expect(enforceBorder(radius, center, body))
    .toMatchCloseTo({
      position: {
        x: center.x + Math.sqrt(1 / 2) * radius,
        y: center.y + Math.sqrt(1 / 2) * radius,
      },
      velocity,
    }, 5)
})

test('outside boundary, outward speed', () => {
  const body = {
    position: {
      x: center.x + radius + 1,
      y: center.y,
    },
    velocity: {
      x: 1,
      y: 1,
    },
  }

  expect(enforceBorder(radius, center, body))
    .toEqual({
      position: {
        x: center.x + radius,
        y: center.y,
      },
      velocity: {
        x: 0,
        y: 1,
      },
    }, 5)
})
