import * as Matter from 'matter-js'
import * as R from 'ramda'
import { GAME_WIDTH, GAME_HEIGHT } from '/constant'


const getCircleVertices = ({ center, radius, steps }) => R.range(0, steps + 1).map((step) => {
  const angle = -1 * step * (2 * Math.PI / steps) - 0.5 * Math.PI
  const x = radius * Math.cos(angle) + center.x
  const y = radius * Math.sin(angle) + center.y
  return { x, y }
})

const createDome = ({ world }) => {
  const vertices = [
    { x: GAME_WIDTH - (GAME_HEIGHT / 2) + 1, y: 1 },
    { x: GAME_WIDTH, y: 1 },
    { x: GAME_WIDTH, y: GAME_HEIGHT },
    { x: GAME_WIDTH - GAME_HEIGHT, y: GAME_HEIGHT },
    { x: GAME_WIDTH - GAME_HEIGHT, y: 1 },
    { x: GAME_WIDTH - (GAME_HEIGHT / 2) - 1, y: 1 },
  ]

  const circleVertices = getCircleVertices({
    center: {
      x: GAME_WIDTH - (GAME_HEIGHT / 2),
      y: GAME_HEIGHT / 2,
    },
    steps: 100,
    radius: (GAME_HEIGHT / 2) - 10,
  })

  const dome = Matter.Bodies.fromVertices(
    700,
    360,
    [
      ...vertices,
      ...circleVertices,
      { x: GAME_WIDTH - (GAME_HEIGHT / 2) + 1, y: 1 },
    ],
    { isStatic: true },
  )
  Matter.World.add(world, [dome])
}


export default ({ world }) => {
  createDome({ world })
}