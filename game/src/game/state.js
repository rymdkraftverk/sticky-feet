import * as R from 'ramda'
import { Colors } from '../../../common'

const namesInReversedOrder = R.pipe(
  R.pluck('name'),
  R.reverse,
)

const state = {
  matterWorld: null,
  pixiStage: null,
  // [Player]
  players: [],
  // [String]
  availableColors: namesInReversedOrder(Colors),
}

export default state

// debug is not a part of the window type
// @ts-ignore
window.debug = {
  // @ts-ignore
  ...window.debug,
  state,
}
