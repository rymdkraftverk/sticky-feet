import * as l1 from 'l1'

import playerRepository from './player/repository'
import pointAtMiddle from './pointAtMiddle'

const DURATION = 30

const pauseMiddlePointing = (id) => {
  const player = playerRepository.find(id)

  l1.remove(player.behaviors.pointAtMiddleId)
  delete player.behaviors.pointAtMiddleId

  l1.once(() => {
    player.behaviors.pointAtMiddleId = pointAtMiddle(player.id)
  }, DURATION)
}

const spin = (id) => {
  const player = playerRepository.find(id)

  const spinBehavior = l1.repeat(() => {
    player.sprite.rotation -= Math.PI * 2 / DURATION
  })
  spinBehavior.id = `spin_${player.id}`

  l1.once(() => {
    l1.remove(spinBehavior.id)
  }, DURATION)
}

const removeSlow = (id) => {
  const player = playerRepository.find(id)
  player.slows = 0
}

export default (id) => {
  pauseMiddlePointing(id)
  spin(id)
  removeSlow(id)
}
