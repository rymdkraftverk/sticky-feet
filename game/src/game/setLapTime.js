import * as R from 'ramda'

import state from './state'

const setLapTime = (lapTime) => {
  const directionChanged = Math.sign(lapTime) !== Math.sign(state.lapTime)

  state.lapTime = lapTime

  if (!directionChanged) {
    return
  }

  state
    .players
    .map(R.prop('sprite'))
    .forEach((sprite) => {
      sprite.scale.x = -sprite.scale.x // eslint-disable-line no-param-reassign
    })
}

export default setLapTime
