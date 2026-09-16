import removePlayer from './remove'
import playerRepository from './repository'
import updateScoreIndicators from '../updateScoreIndicators'

export default (id: string) => {
  if (!playerRepository.has(id)) return
  removePlayer(id)
  updateScoreIndicators()
}
