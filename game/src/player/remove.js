import state from '../state'
import playerRepository from './repository'
import * as entity from '../entity'

export default (matterWorld, id) => {
  const player = playerRepository.find(id)
  const { color: colorName } = player

  // Free color
  state.availableColors.push(colorName)

  entity.remove(
    matterWorld,
    player,
  )
  playerRepository.remove(id)

  return player
}
