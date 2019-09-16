import * as l1 from 'l1'

import playerRepository from './player/repository'

export default (playerId, { id, duration, ability }) => {
  // @ts-ignore
  if (window.debug.disableCooldowns) {
    ability()
    return
  }

  const player = playerRepository.find(playerId)

  if (player.cooldowns[id]) return

  ability()

  player.cooldowns[id] = true

  l1.once(() => {
    player.cooldowns[id] = false
  }, duration)
}
