import * as l2 from 'l2'
import scope from './scope'
import playerRepository from './player/repository'

export default (id: string) => {
  const player = playerRepository.find(id)
  const behaviorId = `scopeFollowsPlayer_${id}`

  l2.repeat(() => {
    scope.updatePosition(id, { distance: player.scope.distance ?? 0 })
  }, 1, { id: behaviorId })

  return behaviorId
}
