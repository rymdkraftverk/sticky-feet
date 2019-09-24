import * as l1 from 'l1'
import playerRepository from './player/repository'

import {
  FULL_BRAKE_TIME,
  MAX_BRAKE_JUMP_POWER,
  DEFAULT_PLAYER_SPRITE_SCALE,
} from './constant'

const BRAKE_JUMP_POWER_INCREMNT = 1 / FULL_BRAKE_TIME

const MIN_SPRITE_SCALE = 1
const SPRITE_SCALE_DIFF = DEFAULT_PLAYER_SPRITE_SCALE - MIN_SPRITE_SCALE

const behaviorId = playerId => `brake_${playerId}`

const spriteScale = brakeJumpPower => (
  DEFAULT_PLAYER_SPRITE_SCALE - brakeJumpPower * SPRITE_SCALE_DIFF
)

const start = (id) => {
  const player = playerRepository.find(id)

  if (player.brakeJumpPower !== 0) return // Guard against race conditions

  const b = l1.repeat(() => {
    if (player.brakeJumpPower < MAX_BRAKE_JUMP_POWER) {
      player.brakeJumpPower += BRAKE_JUMP_POWER_INCREMNT
      const scale = spriteScale(player.brakeJumpPower)
      player.sprite.scale.set(scale)
    }
  })
  b.id = behaviorId(id)
}

const stop = (id) => {
  const player = playerRepository.find(id)

  // Run after brake has stopped
  l1.once(() => {
    player.brakeJumpPower = 0
    player.sprite.scale.set(DEFAULT_PLAYER_SPRITE_SCALE)
  })
  l1.remove(behaviorId(id))
}

export default {
  start,
  stop,
}
