import * as l2 from 'l2'
import state from '../state'
import type { Player } from '../types'

const players = l2.repository<Player>({
  name:  'player',
  read:  () => state.players,
  write: (updated) => {
    state.players = updated
  },
})

const hasBody = (bodyId: number) => state.players.some(p => p.body.id === bodyId)

const findByBody = (bodyId: number) => {
  const player = state.players.find(p => p.body.id === bodyId)
  if (!player) {
    throw new Error(`No player with body ${bodyId}`)
  }
  return player
}

export default {
  ...players,
  findByBody,
  hasBody,
}
