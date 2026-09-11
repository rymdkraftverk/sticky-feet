import state from '../state'
import type { Player } from '../types'

const count = () => state.players.length

const find = (id: string) => {
  const player = state.players.find(p => p.id === id)
  if (!player) {
    throw new Error(`No player with id ${id}`)
  }
  return player
}

const findByBody = (bodyId: number) => {
  const player = state.players.find(p => p.body.id === bodyId)
  if (!player) {
    throw new Error(`No player with body ${bodyId}`)
  }
  return player
}

const all = () => state.players

const add = (player: Player) => {
  state.players = state.players.concat(player)
  return state.players
}

const remove = (id: string) => {
  state.players = state.players.filter(p => p.id !== id)
  return state.players
}

export default {
  add,
  all,
  count,
  find,
  findByBody,
  remove,
}
