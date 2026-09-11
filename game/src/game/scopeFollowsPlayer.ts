import * as l1 from '../l1'
import scope from './scope'
import playerRepository from './player/repository'

export default (id: string) => {
  const player = playerRepository.find(id)
  const behaviorId = `scopeFollowsPlayer_${id}`

  const b = l1.repeat(() => {
    scope.updatePosition(id, { distance: player.scope.distance ?? 0 })
  })

  b.id = behaviorId

  return behaviorId
}
