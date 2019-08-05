import * as l1 from 'l1'
import * as Matter from 'matter-js'

import state from '../state'
import playerRepository from './repository'

export default (matterWorld, id) => {
  const player = playerRepository.find(id)
  const {
    color: colorName,
    sprite,
    body,
  } = player

  // Free color
  state.availableColors.push(colorName)

  // removeEntity
  playerRepository.remove(id)
  l1.remove(`sync_${id}`)
  sprite.destroy()
  Matter.World.remove(matterWorld, body)

  return player
}
