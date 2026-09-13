import * as l2 from 'l2'

import playerRepository from './player/repository'
import pointAtMiddle from './pointAtMiddle'

const DURATION = 30

const pauseMiddlePointing = (id: string) => {
  const player = playerRepository.find(id)

  l2.removeBehavior(player.behaviors.pointAtMiddleId)
  delete player.behaviors.pointAtMiddleId

  l2.once(() => {
    player.behaviors.pointAtMiddleId = pointAtMiddle(player.id)
  }, DURATION)
}

const spin = (id: string) => {
  const player = playerRepository.find(id)

  const behaviorId = `spin_${player.id}`

  l2.repeat(() => {
    player.sprite.rotation -= (Math.PI * 2) / DURATION
  }, 1, { id: behaviorId })

  l2.once(() => {
    l2.removeBehavior(behaviorId)
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
