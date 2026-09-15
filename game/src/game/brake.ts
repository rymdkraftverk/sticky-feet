import * as l2 from 'l2'
import playerRepository from './player/repository'
import scaleSprite, { UPRIGHT, type Squash } from './scaleSprite'

import { FULL_JUMP_LOAD_TIME } from './constant'

const JUMP_POWER_INCREMNT = 1 / FULL_JUMP_LOAD_TIME

const CROUCH: Squash = { x: 1.3, y: 0.55 }

const behaviorId = (playerId: string) => `brake_${playerId}`

const crouch = (jumpPower: number): Squash => ({
  x: UPRIGHT.x + (CROUCH.x - UPRIGHT.x) * jumpPower,
  y: UPRIGHT.y + (CROUCH.y - UPRIGHT.y) * jumpPower,
})

const start = (id: string) => {
  const player = playerRepository.find(id)

  if (player.jumpPower !== 0) return // Guard against race conditions
  if (!player.grounded) return

  player.braking = true

  l2.repeat(() => {
    if (player.jumpPower < 1) {
      player.jumpPower += JUMP_POWER_INCREMNT
      scaleSprite(player.sprite, crouch(player.jumpPower))
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
    scaleSprite(player.sprite, UPRIGHT)
  })
  l2.removeBehavior(behaviorId(id))
}

export default {
  start,
  stop,
}
