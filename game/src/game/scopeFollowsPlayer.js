import * as l1 from 'l1'
import scope from './scope'
import playerRepository from './player/repository'

export default (id) => {
  const player = playerRepository.find(id)

  const b = l1.repeat(() => {
    scope.updatePosition(id, { distance: player.scope.distance })
  })

  b.id = `scopeFollowsPlayer_${id}`

  return b.id
}
