import * as PIXI from 'pixi.js'
import * as l1 from 'l1'
import * as R from 'ramda'

import * as Color from './constant/color'
import state from './state'
import textStyle from './textStyle'
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  TUTORIAL_MODE,
} from './constant'
import { createFrontAnimation } from './player/create'

const BACKGROUND_WIDTH = 270
const BACKGROUND_X = GAME_WIDTH - 270

const TITLE_Y = 20

const ROWS_START_Y = 70
const ROW_MARGIN_Y = 50

const TEXT_Y_OFFSET = 7

let rows = []

const renderRow = ({
  index, name, textures, score,
}) => {
  const container = new PIXI.Container()
  container.y = ROWS_START_Y + index * ROW_MARGIN_Y
  container.x = BACKGROUND_X + 5
  state.pixiStage.addChild(container)

  const sprite = new PIXI.AnimatedSprite(textures)
  sprite.animationSpeed = 0.02
  sprite.play()
  sprite.scale.set(2)

  const nameObject = new PIXI.Text(name, { ...textStyle, fontSize: 14 })
  nameObject.x = 40
  nameObject.y = TEXT_Y_OFFSET
  l1.makeResizable(nameObject)

  const scoreText = new PIXI.Text(score, { ...textStyle, fontSize: 14 })
  scoreText.x = BACKGROUND_WIDTH - 40
  scoreText.y = TEXT_Y_OFFSET
  l1.makeResizable(scoreText)

  container.addChild(sprite)
  container.addChild(nameObject)
  container.addChild(scoreText)
  rows = rows.concat(container)
}

export default () => {
  const background = new PIXI.Graphics()
  background
    .beginFill(l1.fromHex(Color.DARK_GRAY))
    .drawRect(BACKGROUND_X, 0, BACKGROUND_WIDTH, GAME_HEIGHT)
  background.cacheAsBitmap = true

  state.pixiStage.addChild(background)

  const title = new PIXI.Text('Leaderboard', { ...textStyle, fill: Color.LIGHT_GRAY, fontSize: 24 })
  // @ts-ignore
  title.position = { x: BACKGROUND_X + BACKGROUND_WIDTH / 2, y: TITLE_Y }
  title.anchor.x = 0.5
  l1.makeResizable(title)
  state.pixiStage.addChild(title)
}

export const renderLeaderboard = (players) => {
  if (state.mode === TUTORIAL_MODE) {
    return
  }

  const forEach = R.addIndex(R.forEach)

  rows.forEach((row) => {
    row.destroy()
  })
  rows = []

  R.pipe(
    R.sortWith([
      R.descend(R.prop('score')),
    ]),
    forEach(({ score, color }, index) => {
      renderRow({
        index,
        name: color.name,
        score,
        textures: createFrontAnimation(color.name),
      })
    }),
  )(players)
}
