import state from './state'
import scaleSprite from './scaleSprite'

const setLapTime = (lapTime: number) => {
  state.lapTime = lapTime

  state
    .players
    .forEach(({ sprite }) => {
      scaleSprite(sprite, sprite.scale.y)
    })
}

export default setLapTime
