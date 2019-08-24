import * as Matter from 'matter-js'
import playerRepository from './player/repository'
import {
  subtract,
  normalize,
  scale,
} from './linearAlgebra'

import {
  DOME_X,
  DOME_Y,
} from './constant'

const DOME_CENTER = { x: DOME_X, y: DOME_Y }
const JUMP_STRENGTH = 0.2

export default (id) => {
  const { body } = playerRepository.find(id)

  const jumpDirection = normalize(subtract(body.position, DOME_CENTER))
  const jumpVector = scale(JUMP_STRENGTH, jumpDirection)

  Matter.Body.applyForce(
    body,
    {
      x: body.position.x,
      y: body.position.y,
    },
    jumpVector,
  )
}
