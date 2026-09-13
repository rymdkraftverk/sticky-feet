import * as l2 from 'l2'

import playerRepository from './player/repository'

import {
  SLOW_DURATION,
} from './constant'

export default (id: string) => {
  const player = playerRepository.find(id)
  player.slows += 1

  l2.once(() => {
    if (player.slows > 0) player.slows -= 1
  }, SLOW_DURATION)
}
