import * as l1 from 'l1'
import state from '../state'
import playerRepository from './repository'
import * as entity from '../entity'

export default (matterWorld, id) => {
  const player = playerRepository.find(id)
  const {
    autorunId,
    color: colorName,
    scope,
  } = player

  // Free color
  state.availableColors.push(colorName)

  scope.destroy()

  l1.remove(autorunId)

  entity.remove(
    matterWorld,
    player,
  )
  playerRepository.remove(id)

  return player
}
