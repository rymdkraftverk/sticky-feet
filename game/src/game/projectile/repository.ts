import state from '../state'
import type { Projectile } from '../types'

const find = (id: string) => {
  const projectile = state.projectiles.find(p => p.id === id)
  if (!projectile) {
    throw new Error(`No projectile with id ${id}`)
  }
  return projectile
}

const findByBody = (bodyId: number) => {
  const projectile = state.projectiles.find(p => p.body.id === bodyId)
  if (!projectile) {
    throw new Error(`No projectile with body ${bodyId}`)
  }
  return projectile
}

const add = (projectile: Projectile) => {
  state.projectiles = state.projectiles.concat(projectile)
  return state.projectiles
}

const remove = (id: string) => {
  state.projectiles = state.projectiles.filter(p => p.id !== id)
  return state.projectiles
}

export default {
  add,
  find,
  findByBody,
  remove,
}
