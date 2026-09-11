import leaderboard from './leaderboard'
import assignCrown from './assignCrown'

export default () => {
  leaderboard.renderContent()
  assignCrown()
}
