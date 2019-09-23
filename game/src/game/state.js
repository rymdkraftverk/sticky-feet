import * as R from 'ramda'
import getUrlParams from '../getUrlParams'
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
  // [Projectile]
  projectiles: [],
  // [String]
  availableColors: namesInReversedOrder(Colors),
  // Mode
  mode: getUrlParams().mode,
}

export default state
