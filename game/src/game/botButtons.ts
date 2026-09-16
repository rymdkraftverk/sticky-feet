import * as l2 from 'l2'
import * as PIXI from 'pixi.js'

import * as bot from './bot'
import * as Color from './constant/color'
import state from './state'
import textStyle from './textStyle'
import { GAME_WIDTH, SIDEBAR_WIDTH } from './constant'

const Y = 695
const ADD_X = GAME_WIDTH - (SIDEBAR_WIDTH * 3) / 4
const REMOVE_X = GAME_WIDTH - SIDEBAR_WIDTH / 4

const button = (text: string, x: number, onTap: () => void) => {
  const label = new PIXI.Text({
    text,
    style: { ...textStyle, fill: Color.LIGHT_GRAY, fontSize: 18 },
  })
  label.position.set(x, Y)
  label.anchor.set(0.5)
  label.eventMode = 'static'
  label.cursor = 'pointer'
  label.on('pointerover', () => { label.style.fill = Color.WHITE })
  label.on('pointerout', () => { label.style.fill = Color.LIGHT_GRAY })
  label.on('pointertap', onTap)
  l2.makeResizable(label)
  state.pixiStage.addChild(label)
}

export default () => {
  button('+ Bot', ADD_X, () => bot.add())
  button('- Bot', REMOVE_X, bot.remove)
}
