import * as R from 'ramda'

import {
  add,
  fromPolar,
} from '../linearAlgebra'

import { DOME_CENTER } from '../constant'

const DISTANCE_FROM_MIDDLE = 1

const randomAngle = () => Math.random() * Math.PI * 2

const spawnPosition = angle => add(
  DOME_CENTER,
  fromPolar(angle, DISTANCE_FROM_MIDDLE),
)

export default R.pipe(
  randomAngle,
  spawnPosition,
)
