import * as l1 from 'l1'

import playerRepository from './player/repository'

import {
  SLOW_FACTOR,
  SLOW_DURATION,
} from './constant'

export default (id) => {
  const player = playerRepository.find(id)
  player.speed /= SLOW_FACTOR

  l1.once(() => {
    player.speed *= SLOW_FACTOR
  }, SLOW_DURATION)
}
