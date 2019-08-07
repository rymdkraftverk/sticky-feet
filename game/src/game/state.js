import * as R from 'ramda'
import { Colors } from '../../../common'

const namesInReversedOrder = R.pipe(
  R.pluck('name'),
  R.reverse,
)

const state = {
  // [Player]
  players: [],
  // [String]
  availableColors: namesInReversedOrder(Colors),
}

export default state

window.debug = {
  ...window.debug,
  state,
}
