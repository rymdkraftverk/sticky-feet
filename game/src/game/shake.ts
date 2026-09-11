import * as l1 from '../l1'

import playerRepository from './player/repository'
import pointAtMiddle from './pointAtMiddle'

const DURATION = 30

const pauseMiddlePointing = (id: string) => {
  const player = playerRepository.find(id)

  l1.remove(player.behaviors.pointAtMiddleId)
  delete player.behaviors.pointAtMiddleId

  l1.once(() => {
    player.behaviors.pointAtMiddleId = pointAtMiddle(player.id)
  }, DURATION)
}

const spin = (id: string) => {
  const player = playerRepository.find(id)

  const behaviorId = `spin_${player.id}`

  const spinBehavior = l1.repeat(() => {
    player.sprite.rotation -= (Math.PI * 2) / DURATION
  })
  spinBehavior.id = behaviorId

  l1.once(() => {
    l1.remove(behaviorId)
  }, DURATION)
}

const removeSlow = (id: string) => {
  const player = playerRepository.find(id)
  player.slows = 0
}

export default (id: string) => {
  pauseMiddlePointing(id)
  spin(id)
  removeSlow(id)
}
