import {
  angularVelocity,
  distance,
  gapAhead,
  interceptAngle,
  jumpRadii,
  orbit,
} from '../../src/game/bot/predict'

const center = { x: 0, y: 0 }

test('a target ahead is a small gap forward and a large gap backward', () => {
  const from = { x: 10, y: 0 }
  const to = { x: 0, y: 10 }

  expect(gapAhead(center, 1, from, to)).toBeCloseTo(Math.PI / 2)
  expect(gapAhead(center, -1, from, to)).toBeCloseTo((3 * Math.PI) / 2)
})

test('orbiting a quarter lap moves a point to the next axis', () => {
  const moved = orbit(center, { x: 10, y: 0 }, Math.PI / 2)

  expect(moved.x).toBeCloseTo(0)
  expect(moved.y).toBeCloseTo(10)
})

test('a shot along the intercept angle meets the moving target', () => {
  const from = { x: -100, y: 0 }
  const target = { x: 100, y: 0 }
  const spin = angularVelocity(7)
  const speed = 10

  const angle = interceptAngle({
    center, from, target, targetAngularVelocity: spin, speed, maxTicks: 90,
  }) as number

  const hits = Array
    .from({ length: 90 }, (_, index) => index + 1)
    .some(t => distance(
      { x: from.x + speed * t * Math.cos(angle), y: from.y + speed * t * Math.sin(angle) },
      orbit(center, target, spin * t),
    ) < speed)

  expect(hits).toBe(true)
})

test('an unreachable target has no intercept', () => {
  expect(interceptAngle({
    center,
    from: { x: -100, y: 0 },
    target: { x: 100, y: 0 },
    targetAngularVelocity: 0,
    speed: 1,
    maxTicks: 10,
  })).toBeUndefined()
})

test('a stronger jump goes further in and lasts longer', () => {
  const weak = jumpRadii(300, 0.3, 300, angularVelocity(7))
  const strong = jumpRadii(300, 0.6, 300, angularVelocity(7))

  expect(Math.min(...strong)).toBeLessThan(Math.min(...weak))
  expect(strong.length).toBeGreaterThan(weak.length)
})
