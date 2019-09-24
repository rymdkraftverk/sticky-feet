import Sound from './sound'
import playerRepository from './player/repository'
import {
  add,
  subtract,
  normalize,
  scale,
} from './linearAlgebra'

import {
  DOME_CENTER,
  MAX_JUMP_STRENGTH,
} from './constant'

export default (id) => {
  const {
    body,
    brakeJumpPower,
  } = playerRepository.find(id)

  const jumpDirection = normalize(subtract(body.position, DOME_CENTER))
  const jumpStrength = MAX_JUMP_STRENGTH * brakeJumpPower
  const jumpVector = scale(jumpStrength, jumpDirection)

  body.velocity = add(jumpVector, body.velocity)
  Sound.JUMP.play()
}
