import * as PIXI from 'pixi.js'
import * as ex from 'pixi-ex'

import * as Color from './constant/color'
import textStyle from './textStyle'

import {
  GAME_HEIGHT,
  DOME_X,
  DOME_Y,
  SIDEBAR_WIDTH,
} from './constant'

import state from './state'

const CONTROLLER_HOST = process.env.CONTROLLER_HOST || 'localhost:4001'

const createDome = () => {
  const domeSprite = new PIXI.Sprite(ex.getTexture('bg'))
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

  instructionArrow.alpha = 0.15
  instructionArrow.x = x
  instructionArrow.y = y
  instructionArrow.anchor.set(0.5)
  instructionArrow.angle = angle

  instructionArrow.cacheAsBitmap = true

  return instructionArrow
}

const PHONE_Y = 50
const URL_Y = 190
const CODE_Y = 370

const createJoinInstructions = (gameCode) => {
  const background = new PIXI.Graphics()
  background
    .beginFill(ex.fromHex(Color.DARK_GRAY))
    .drawRect(0, 0, SIDEBAR_WIDTH, GAME_HEIGHT)
  state.pixiStage.addChild(background)

  const grabYourPhone = new PIXI.Text('Grab your phone',
    {
      ...textStyle,
      fill: Color.WHITE,
      fontSize: 20,
    })
  grabYourPhone.position.set(SIDEBAR_WIDTH / 2, PHONE_Y)
  grabYourPhone.anchor.set(0.5)
  ex.makeResizable(grabYourPhone)
  state.pixiStage.addChild(grabYourPhone)

  const arrow1 = drawInstructionArrow({
    x: SIDEBAR_WIDTH / 2,
    y: PHONE_Y + 70,
    angle: 90,
  })
  state.pixiStage.addChild(arrow1)

  const urlLabel = new PIXI.Text('Go to', { ...textStyle, fill: Color.LIGHT_GRAY })
  urlLabel.position.set(SIDEBAR_WIDTH / 2, URL_Y)
  urlLabel.anchor.set(0.5)
  ex.makeResizable(urlLabel)
  state.pixiStage.addChild(urlLabel)

  const url = new PIXI.Text(
    CONTROLLER_HOST,
    { ...textStyle, fontFamily: 'Arial' },
  )
  url.position.set(SIDEBAR_WIDTH / 2, URL_Y + 40)
  url.anchor.set(0.5)
  ex.makeResizable(url)
  state.pixiStage.addChild(url)

  const arrow2 = drawInstructionArrow({
    x: SIDEBAR_WIDTH / 2,
    y: URL_Y + 110,
    angle: 90,
  })
  state.pixiStage.addChild(arrow2)

  const codeLabel = new PIXI.Text('Code', { ...textStyle, fill: Color.LIGHT_GRAY })
  codeLabel.position.set(SIDEBAR_WIDTH / 2, CODE_Y)
  codeLabel.anchor.set(0.5)
  ex.makeResizable(codeLabel)
  state.pixiStage.addChild(codeLabel)

  const code = new PIXI.Text(gameCode, {
    ...textStyle, fontFamily: 'Arial', fontSize: 72, fill: Color.RED,
  })
  code.position.set(SIDEBAR_WIDTH / 2, CODE_Y + 60)
  code.anchor.set(0.5)
  ex.makeResizable(code)
  state.pixiStage.addChild(code)
}

export default (gameCode) => {
  createDome()
  createJoinInstructions(gameCode)
}
