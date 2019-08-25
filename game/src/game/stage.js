import * as PIXI from 'pixi.js'
import * as l1 from 'l1'
import * as Matter from 'matter-js'
import * as R from 'ramda'

import textStyle from './textStyle'

import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CENTER_X,
  CENTER_Y,
  DOME_X,
  DOME_Y,
} from './constant'

import state from './state'

const getCircleVertices = ({ center, radius, steps }) => R.range(0, steps + 1).map((step) => {
  const angle = -1 * step * (2 * Math.PI / steps) - 0.5 * Math.PI
  const x = radius * Math.cos(angle) + center.x
  const y = radius * Math.sin(angle) + center.y
  return { x, y }
})

const createDome = () => {
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
  Matter.World.add(state.matterWorld, [dome])

  const domeSprite = new PIXI.Sprite(l1.getTexture('dome-0'))
  domeSprite.scale.set(5.65)
  domeSprite.anchor.set(0.5)
  domeSprite.x = DOME_X
  domeSprite.y = DOME_Y
  state.pixiStage.addChild(domeSprite)

  // This is used to mark the center for debug purposes
  const marker = Matter.Bodies.circle(DOME_X, DOME_Y, 15, { isStatic: true })
  Matter.World.add(state.matterWorld, [marker])
}

const TEXT_X = 12
const URL_Y = 50
const CODE_Y = 150

const createJoinInstructions = (gameCode) => {
  const urlLabel = new PIXI.Text('Url', { ...textStyle, fill: '#aaaaaa' })
  // @ts-ignore
  urlLabel.position = { x: TEXT_X, y: URL_Y }
  l1.makeResizable(urlLabel)
  state.pixiStage.addChild(urlLabel)

  const url = new PIXI.Text('www.fightgame.com', { ...textStyle, fontFamily: 'Arial' })
  // @ts-ignore
  url.position = { x: TEXT_X, y: URL_Y + 26 }
  l1.makeResizable(url)
  state.pixiStage.addChild(url)

  const codeLabel = new PIXI.Text('Code', { ...textStyle, fill: '#aaaaaa' })
  // @ts-ignore
  codeLabel.position = { x: TEXT_X, y: CODE_Y }
  l1.makeResizable(codeLabel)
  state.pixiStage.addChild(codeLabel)

  const code = new PIXI.Text(gameCode, { ...textStyle, fontFamily: 'Arial', fontSize: 64 })
  // @ts-ignore
  code.position = { x: TEXT_X, y: CODE_Y + 26 }
  l1.makeResizable(code)
  state.pixiStage.addChild(code)
}

export default (gameCode) => {
  createDome()
  createJoinInstructions(gameCode)
}
