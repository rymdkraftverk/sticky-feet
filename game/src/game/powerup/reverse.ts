import state from '../state'
import setLapTime from '../setLapTime'

export default {
  texture: 'powerup-reverse',
  onPickup: () => {
    setLapTime(-state.lapTime)
  },
}
