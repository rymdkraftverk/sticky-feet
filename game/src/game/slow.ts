import * as l2 from 'l2'

import playerRepository from './player/repository'
import type { Player } from './types'

import {
  SLOW_DURATION,
} from './constant'

const showSplat = (player: Player) => {
  player.splat.visible = player.slows > 0
}

export default (id: string) => {
  const player = playerRepository.find(id)
  player.slows += 1
  showSplat(player)

  l2.once(() => {
    if (player.slows > 0) player.slows -= 1
    showSplat(player)
  }, SLOW_DURATION)
}
