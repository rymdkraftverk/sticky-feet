import { Colors } from 'common'

import Sound from '../sound'
import createPlayer from './create'
import playerRepository from './repository'
import updateScoreIndicators from '../updateScoreIndicators'
import type { Figure } from './figure'

export const hasRoom = () => playerRepository.count() < Colors.length

export default (id: string, figure: Figure) => {
  const player = createPlayer(id, figure)
  Sound.UI_04.play()
  updateScoreIndicators()
  return player
}
