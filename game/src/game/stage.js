import * as PIXI from 'pixi.js'
import * as ex from 'pixi-ex'

import * as Color from './constant/color'
import textStyle from './textStyle'

import {
  GAME_HEIGHT,
  DOME_X,
  DOME_Y,
} from './constant'


import state from './state'

const CONTROLLER_HOST = process.env.CONTROLLER_HOST || 'localhost:4001'

const createDome = () => {
  const domeSprite = new PIXI.Sprite(ex.getTexture('dome-0'))
  domeSprite.scale.set(1)
  domeSprite.anchor.set(0.5)
  domeSprite.x = DOME_X
  domeSprite.y = DOME_Y
  state.pixiStage.addChild(domeSprite)
}

const drawInstructionArrow = ({
  x, y, angle,
}) => {
  const instructionArrow = new PIXI.Sprite(ex.getTexture('expand-arrow-one'))

  instructionArrow.alpha = 0.2
  instructionArrow.x = x
  instructionArrow.y = y
  instructionArrow.angle = angle

  instructionArrow.cacheAsBitmap = true

  return instructionArrow
}

const TEXT_X = 15
const ARROW_X = TEXT_X + 150
const PHONE_Y = 50
const URL_Y = 155
const CODE_Y = 300

const BACKGROUND_WIDTH = 270

const createJoinInstructions = (gameCode) => {
  const background = new PIXI.Graphics()
  background
    .beginFill(ex.fromHex(Color.DARK_GRAY))
    .drawRect(0, 0, BACKGROUND_WIDTH, GAME_HEIGHT)
  state.pixiStage.addChild(background)

  const grabYourPhone = new PIXI.Text('Grab your phone',
    {
      ...textStyle,
      fill: Color.LIGHT_GRAY,
      fontSize: 20,
    })
  grabYourPhone.position.set(TEXT_X, PHONE_Y)
  ex.makeResizable(grabYourPhone)
  state.pixiStage.addChild(grabYourPhone)

  const arrow1 = drawInstructionArrow({
    x: ARROW_X,
    y: PHONE_Y + 15,
    angle: 90,
  })
  state.pixiStage.addChild(arrow1)

  const urlLabel = new PIXI.Text('Go to', { ...textStyle, fill: Color.LIGHT_GRAY })
  urlLabel.position.set(TEXT_X, URL_Y)
  ex.makeResizable(urlLabel)
  state.pixiStage.addChild(urlLabel)

  const url = new PIXI.Text(
    CONTROLLER_HOST,
    { ...textStyle, fontFamily: 'Arial' },
  )
  url.position.set(TEXT_X, URL_Y + 30)
  ex.makeResizable(url)
  state.pixiStage.addChild(url)

  const arrow2 = drawInstructionArrow({
    x: ARROW_X,
    y: URL_Y + 58,
    angle: 90,
  })
  state.pixiStage.addChild(arrow2)

  const codeLabel = new PIXI.Text('Code', { ...textStyle, fill: Color.LIGHT_GRAY })
  codeLabel.position.set(TEXT_X, CODE_Y)
  ex.makeResizable(codeLabel)
  state.pixiStage.addChild(codeLabel)

  const code = new PIXI.Text(gameCode, {
    ...textStyle, fontFamily: 'Arial', fontSize: 64, fill: Color.RED,
  })
  code.position.set(TEXT_X, CODE_Y + 26)
  ex.makeResizable(code)
  state.pixiStage.addChild(code)
}

export default (gameCode) => {
  createDome()
  createJoinInstructions(gameCode)
}
