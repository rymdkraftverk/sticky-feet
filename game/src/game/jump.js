import playerRepository from './player/repository'
import {
  add,
  subtract,
  normalize,
  scale,
} from './linearAlgebra'

import {
  DOME_CENTER,
  JUMP_STRENGTH,
} from './constant'

export default (id) => {
  console.log('jump detected')
  const { body } = playerRepository.find(id)

  const jumpDirection = normalize(subtract(body.position, DOME_CENTER))
  const jumpVector = scale(JUMP_STRENGTH, jumpDirection)

  body.velocity = add(jumpVector, body.velocity)
}
