import * as PIXI from 'pixi.js'
import * as l1 from 'l1'
import * as Matter from 'matter-js'
import * as R from 'ramda'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CENTER_X,
  CENTER_Y,
  DOME_X,
  DOME_Y,
} from './constant'

const getCircleVertices = ({ center, radius, steps }) => R.range(0, steps + 1).map((step) => {
  const angle = -1 * step * (2 * Math.PI / steps) - 0.5 * Math.PI
  const x = radius * Math.cos(angle) + center.x
  const y = radius * Math.sin(angle) + center.y
  return { x, y }
})

const createDome = ({ world, app }) => {
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
      x: CENTER_X,
      y: CENTER_Y,
    },
    steps: 100,
    radius: (GAME_HEIGHT / 2) - 10,
  })

  const dome = Matter.Bodies.fromVertices(
    DOME_X,
    DOME_Y,
    [
      ...vertices,
      ...circleVertices,
      { x: DOME_X + 1, y: 1 },
    ],
    { isStatic: true, friction: 0 },
  )
  Matter.World.add(world, [dome])

  const domeSprite = new PIXI.Sprite(l1.getTexture('dome-0'))
  domeSprite.scale.set(5.65)
  domeSprite.anchor.set(0.5)
  domeSprite.x = DOME_X
  domeSprite.y = DOME_Y
  app.stage.addChild(domeSprite)

  // This is used to mark the center for debug purposes
  const marker = Matter.Bodies.circle(DOME_X, DOME_Y, 15, { isStatic: true })
  Matter.World.add(world, [marker])
}


export default ({ world, app }) => {
  createDome({ world, app })
}
