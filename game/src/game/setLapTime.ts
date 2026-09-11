import state from './state'

const setLapTime = (lapTime: number) => {
  const directionChanged = Math.sign(lapTime) !== Math.sign(state.lapTime)

  state.lapTime = lapTime

  if (!directionChanged) {
    return
  }

  state
    .players
    .map(({ sprite }) => sprite)
    .forEach((sprite) => {
      sprite.scale.x = -sprite.scale.x  
    })
}

export default setLapTime
