import * as R from 'ramda'
import { Colors } from 'common'
import getUrlParams from '../getUrlParams'
import { DEFAULT_LAP_TIME } from './constant'

const namesInReversedOrder = R.pipe(
  R.pluck('name'),
  R.reverse,
)

const state = {
  matterWorld: /** @type {import('matter-js').World} */ (/** @type {*} */ (null)),
  pixiStage: /** @type {import('pixi.js').Container} */ (/** @type {*} */ (null)),
  // [Player]
  /** @type {{ id: string, color: string, body?: * , sprite?: * }[]} */
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
