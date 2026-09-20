import * as Matter from 'matter-js'
import * as l2 from 'l2'

import collider from '../src/game/collider'
import state from '../src/game/state'
import type { Player, Projectile } from '../src/game/types'

vi.mock('../src/game/sound', () => ({
  default: new Proxy({}, { get: () => () => {} }),
}))

const body = (entityType: Matter.Body['entityType'], x: number) => {
  const created = Matter.Bodies.circle(x, 0, 10, { isSensor: true })
  created.entityType = entityType
  return created
}

const player = (id: string, x: number) => ({
  id,
  body: body('player', x),
  behaviors: {},
  slows: 0,
  splat: { visible: false },
}) as unknown as Player

test('a projectile removed on a hit collides with no one before it leaves the world', () => {
  const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } })
  state.matterWorld = engine.world
  Matter.Events.on(engine, 'collisionStart', collider)

  const hit = player('hit', 0)
  const bystander = player('bystander', 500)
  const projectile = {
    id: 'glob',
    body: body('projectile', 0),
    behaviors: {},
    firedBy: 'shooter',
    sprite: { destroy: () => {} },
  } as unknown as Projectile

  state.players = [hit, bystander]
  state.projectiles = [projectile]
  Matter.World.add(engine.world, [hit.body, bystander.body, projectile.body])

  Matter.Engine.update(engine)
  expect(hit.slows).toBe(1)
  expect(state.projectiles).toEqual([])

  Matter.Body.setPosition(hit.body, { x: -500, y: 0 })
  Matter.Body.setPosition(bystander.body, { x: 0, y: 0 })
  expect(() => Matter.Engine.update(engine)).not.toThrow()
  expect(bystander.slows).toBe(0)

  l2.update(1)
  expect(engine.world.bodies).not.toContain(projectile.body)
})
