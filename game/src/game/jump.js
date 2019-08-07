import * as Matter from 'matter-js'
import playerRepository from './player/repository'

export default (id) => {
  const { body } = playerRepository.find(id)

  Matter.Body.applyForce(
    body,
    {
      x: body.position.x,
      y: body.position.y,
    },
    {
      x: 0,
      y: -0.2,
    },
  )
}
