import * as l1 from '../l1'

import playerRepository from './player/repository'
import { DOME_X, DOME_Y } from './constant'

export default (id: string) => {
  const { sprite } = playerRepository.find(id)
  const behaviorId = `point_at_middle_${id}`

  const behavior = l1.repeat(() => {
    sprite.rotation = Math.atan2(
      sprite.position.y - DOME_Y,
      sprite.position.x - DOME_X,
    ) - Math.PI / 2
  })

  behavior.id = behaviorId
  return behaviorId
}
