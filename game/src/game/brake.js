import * as l1 from 'l1'
import playerRepository from './player/repository'

import {
  FULL_JUMP_LOAD_TIME,
  DEFAULT_PLAYER_SPRITE_SCALE,
} from './constant'

const JUMP_POWER_INCREMNT = 1 / FULL_JUMP_LOAD_TIME

const MIN_SPRITE_SCALE = 1
const SPRITE_SCALE_DIFF = DEFAULT_PLAYER_SPRITE_SCALE - MIN_SPRITE_SCALE

const behaviorId = playerId => `brake_${playerId}`

const spriteScale = jumpPower => (
  DEFAULT_PLAYER_SPRITE_SCALE - jumpPower * SPRITE_SCALE_DIFF
)

const start = (id) => {
  const player = playerRepository.find(id)

  if (player.jumpPower !== 0) return // Guard against race conditions

  player.braking = true

  const b = l1.repeat(() => {
    if (player.jumpPower < 1) {
      player.jumpPower += JUMP_POWER_INCREMNT
      const scale = spriteScale(player.jumpPower)
      player.sprite.scale.set(scale)
    }
  })
  b.id = behaviorId(id)
}

const stop = (id) => {
  const player = playerRepository.find(id)

  // Run after brake has stopped
  l1.once(() => {
    player.braking = false
    player.jumpPower = 0
    player.sprite.scale.set(DEFAULT_PLAYER_SPRITE_SCALE)
  })
  l1.remove(behaviorId(id))
}

export default {
  start,
  stop,
}
