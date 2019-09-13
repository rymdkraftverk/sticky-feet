import * as l1 from 'l1'

import playerRepository from './player/repository'

import {
  SLOW_DURATION,
} from './constant'

export default (id) => {
  const player = playerRepository.find(id)
  player.slows += 1

  l1.once(() => {
    if (player.slows > 0) player.slows -= 1
  }, SLOW_DURATION)
}
