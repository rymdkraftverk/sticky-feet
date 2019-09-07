import {
  DOME_X,
  GAME_HEIGHT,
} from '../constant'

export default () => ({
  x: (DOME_X - GAME_HEIGHT / 2) + 20,
  y: 400,
})
