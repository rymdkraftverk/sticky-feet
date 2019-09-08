import state from '../state'
import playerRepository from './repository'
import * as entity from '../entity'

export default (id) => {
  const player = playerRepository.find(id)
  const {
    color: {
      name: colorName,
    },
    scope,
  } = player

  // Free color
  state.availableColors.push(colorName)

  scope.destroy()

  entity.remove(player)
  playerRepository.remove(id)

  return player
}
