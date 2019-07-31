import * as R from 'ramda'
import { Colors } from '../../common'

const state = {
  // [Player]
  players: [],
  // [String]
  availableColors: R.pluck('name', Colors),
}

export default state

window.debug = {
  ...window.debug,
  state,
}
