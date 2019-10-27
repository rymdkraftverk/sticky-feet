import * as R from 'ramda'
import getUrlParams from '../getUrlParams'
import { Colors } from '../../../common'
import { DEFAULT_LAP_TIME } from './constant'

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
  lapTime: DEFAULT_LAP_TIME,
}

export default state
