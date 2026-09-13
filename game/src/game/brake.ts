import * as l2 from 'l2'
import playerRepository from './player/repository'
import scaleSprite from './scaleSprite'

import {
  FULL_JUMP_LOAD_TIME,
  DEFAULT_PLAYER_SPRITE_SCALE,
} from './constant'

const JUMP_POWER_INCREMNT = 1 / FULL_JUMP_LOAD_TIME

const MIN_SPRITE_SCALE = 1
const SPRITE_SCALE_DIFF = DEFAULT_PLAYER_SPRITE_SCALE - MIN_SPRITE_SCALE

const behaviorId = (playerId: string) => `brake_${playerId}`

const spriteScale = (jumpPower: number) => (
  DEFAULT_PLAYER_SPRITE_SCALE - jumpPower * SPRITE_SCALE_DIFF
)

const start = (id: string) => {
  const player = playerRepository.find(id)

  if (player.jumpPower !== 0) return // Guard against race conditions
  if (!player.grounded) return

  player.braking = true

  l2.repeat(() => {
    if (player.jumpPower < 1) {
      player.jumpPower += JUMP_POWER_INCREMNT
      scaleSprite(player.sprite, spriteScale(player.jumpPower))
    }
  }, 1, { id: behaviorId(id) })
}

const stop = (id: string) => {
  const player = playerRepository.find(id)

  if (player.jumpPower === 0) return

  // Run after brake has stopped
  l2.once(() => {
    player.braking = false
    player.jumpPower = 0
    scaleSprite(player.sprite, DEFAULT_PLAYER_SPRITE_SCALE)
  })
  l2.removeBehavior(behaviorId(id))
}

export default {
  start,
  stop,
}
