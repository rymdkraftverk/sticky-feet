import * as l1 from 'l1'

import playerRepository from './player/repository'

const SPEED_FACTOR = 10

export default (id) => {
  const player = playerRepository.find(id)
  player.speed *= SPEED_FACTOR

  l1.once(() => {
    player.speed /= SPEED_FACTOR
  }, 3)
}
