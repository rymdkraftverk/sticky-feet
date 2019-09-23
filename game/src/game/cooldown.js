import * as l1 from 'l1'

import state from './state'
import debugLog from './debugLog'
import playerRepository from './player/repository'

import { TUTORIAL_MODE } from './constant'

export default (playerId, { id, duration, ability }) => {
  if (state.mode === TUTORIAL_MODE) {
    ability()
    return
  }

  const player = playerRepository.find(playerId)

  if (player.cooldowns[id]) {
    debugLog(`${id} is on cooldown for player ${id}`)
    return
  }

  ability()

  player.cooldowns[id] = true

  l1.once(() => {
    player.cooldowns[id] = false
  }, duration)
}
