import * as l2 from 'l2'
import state from '../state'
import type { Projectile } from '../types'

const projectiles = l2.repository<Projectile>({
  name:  'projectile',
  read:  () => state.projectiles,
  write: (updated) => {
    state.projectiles = updated
  },
})

const hasBody = (bodyId: number) => state.projectiles.some(p => p.body.id === bodyId)

const findByBody = (bodyId: number) => {
  const projectile = state.projectiles.find(p => p.body.id === bodyId)
  if (!projectile) {
    throw new Error(`No projectile with body ${bodyId}`)
  }
  return projectile
}

export default {
  ...projectiles,
  findByBody,
  hasBody,
}
