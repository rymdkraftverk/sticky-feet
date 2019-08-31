import * as PIXI from 'pixi.js'
import * as l1 from 'l1'

import state from './state'
import textStyle from './textStyle'
import { GAME_HEIGHT, GAME_WIDTH } from './constant'

const BACKGROUND_WIDTH = 270
const BACKGROUND_X = GAME_WIDTH - 270

const TITLE_Y = 20

const ROWS_START_Y = 70
const ROW_MARGIN_Y = 50

const renderRow = ({
  index, name, texture,
}) => {
  const container = new PIXI.Container()
  container.y = ROWS_START_Y + index * ROW_MARGIN_Y
  container.x = BACKGROUND_X + 5
  state.pixiStage.addChild(container)

  const sprite = new PIXI.Sprite(l1.getTexture(texture))
  sprite.scale.set(2)

  const nameObject = new PIXI.Text(name, { ...textStyle, fontSize: 14 })
  nameObject.x = 40
  nameObject.y = 5
  l1.makeResizable(nameObject)

  const score = new PIXI.Text('42', { ...textStyle, fontSize: 14 })
  score.x = BACKGROUND_WIDTH - 40
  score.y = 5
  l1.makeResizable(score)

  container.addChild(sprite)
  container.addChild(nameObject)
  container.addChild(score)
}

export default () => {
  const background = new PIXI.Graphics()
  background
    .beginFill(l1.fromHex('#111111'))
    .drawRect(BACKGROUND_X, 0, BACKGROUND_WIDTH, GAME_HEIGHT)
  background.cacheAsBitmap = true

  state.pixiStage.addChild(background)

  const title = new PIXI.Text('Leaderboard', { ...textStyle, fill: '#aaaaaa', fontSize: 24 })
  // @ts-ignore
  title.position = { x: BACKGROUND_X + BACKGROUND_WIDTH / 2, y: TITLE_Y }
  title.anchor.x = 0.5
  l1.makeResizable(title)
  state.pixiStage.addChild(title)

  renderRow({ index: 0, name: 'Faberly', texture: 'lizard-43' })
  renderRow({ index: 1, name: 'Sajmoni', texture: 'lizard-43' })
  renderRow({ index: 2, name: 'Axel Ulmestig', texture: 'lizard-43' })
  renderRow({ index: 3, name: 'lorentzlasson', texture: 'lizard-43' })
  renderRow({ index: 4, name: 'lorentzlasson', texture: 'lizard-43' })
  renderRow({ index: 5, name: 'lorentzlasson', texture: 'lizard-43' })
  renderRow({ index: 6, name: 'lorentzlasson', texture: 'lizard-43' })
  renderRow({ index: 7, name: 'lorentzlasson', texture: 'lizard-43' })
  renderRow({ index: 8, name: 'lorentzlasson', texture: 'lizard-43' })
  renderRow({ index: 9, name: 'lorentzlasson', texture: 'lizard-43' })
  renderRow({ index: 10, name: 'lorentzlasson', texture: 'lizard-43' })
  renderRow({ index: 11, name: 'lorentzlasson', texture: 'lizard-43' })
}
