import * as l2 from 'l2'

import playerRepository from './player/repository'

import {
  SLOW_DURATION,
} from './constant'

const showSplat = (id: string) => {
  const player = playerRepository.find(id)
  player.splat.visible = player.slows > 0
}

export default (id: string) => {
  const player = playerRepository.find(id)
  player.slows += 1
  showSplat(id)

  l2.once(() => {
    if (player.slows > 0) player.slows -= 1
    showSplat(id)
  }, SLOW_DURATION)
}
