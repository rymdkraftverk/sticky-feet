import * as l2 from 'l2'
import state from '../state'
import type { Powerup } from '../types'

const powerups = l2.repository<Powerup>({
  name:  'powerup',
  read:  () => state.powerups,
  write: (updated) => {
    state.powerups = updated
  },
})

const hasBody = (bodyId: number) => state.powerups.some(p => p.body.id === bodyId)

const findByBody = (bodyId: number) => {
  const powerup = state.powerups.find(p => p.body.id === bodyId)
  if (!powerup) {
    throw new Error(`No powerup with body ${bodyId}`)
  }
  return powerup
}

export default {
  ...powerups,
  findByBody,
  hasBody,
}
