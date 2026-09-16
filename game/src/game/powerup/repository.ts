import state from '../state'
import type { Powerup } from '../types'

const count = () => state.powerups.length

const find = (id: string) => {
  const powerup = state.powerups.find(p => p.id === id)
  if (!powerup) {
    throw new Error(`No powerup with id ${id}`)
  }
  return powerup
}

const hasBody = (bodyId: number) => state.powerups.some(p => p.body.id === bodyId)

const findByBody = (bodyId: number) => {
  const powerup = state.powerups.find(p => p.body.id === bodyId)
  if (!powerup) {
    throw new Error(`No powerup with body ${bodyId}`)
  }
  return powerup
}

const add = (powerup: Powerup) => {
  state.powerups = state.powerups.concat(powerup)
  return state.powerups
}

const remove = (id: string) => {
  state.powerups = state.powerups.filter(p => p.id !== id)
  return state.powerups
}

export default {
  add,
  count,
  find,
  findByBody,
  hasBody,
  remove,
}
