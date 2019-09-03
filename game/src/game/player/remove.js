import * as l1 from 'l1'
import state from '../state'
import playerRepository from './repository'
import * as entity from '../entity'

export default (id) => {
  const player = playerRepository.find(id)
  const {
    autorunId,
    gravityId,
    borderPatrolId,
    pointAtMiddleId,
    color: {
      name: colorName,
    },
    scope,
  } = player

  // Free color
  state.availableColors.push(colorName)

  scope.destroy()

  l1.remove(autorunId)
  l1.remove(gravityId)
  l1.remove(borderPatrolId)
  l1.remove(pointAtMiddleId)

  entity.remove(player)
  playerRepository.remove(id)

  return player
}
