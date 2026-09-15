import * as l2 from 'l2'
import * as PIXI from 'pixi.js'

import * as Color from './constant/color'
import state from './state'
import textStyle from './textStyle'
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  SIDEBAR_WIDTH,
  TUTORIAL_MODE,
} from './constant'
import createFigure from './player/figure'

const BACKGROUND_X = GAME_WIDTH - SIDEBAR_WIDTH

const TITLE_Y = 20

const ROWS_START_Y = 70
const ROW_MARGIN_Y = 50

const TEXT_Y_OFFSET = 12
const TEXT_X = 46

const IDLE_ANIMATION_SPEED = 0.02

const rows: PIXI.Container[] = []

const renderRow = ({
  index, name, hex, score,
}: {
  index: number
  name: string
  hex: string
  score: number
}) => {
  const container = new PIXI.Container()
  container.y = ROWS_START_Y + index * ROW_MARGIN_Y
  container.x = BACKGROUND_X + 5
  state.pixiStage.addChild(container)

  const figure = createFigure('front', hex, IDLE_ANIMATION_SPEED)

  const nameObject = new PIXI.Text({ text: name, style: { ...textStyle, fontSize: 14 } })
  nameObject.x = TEXT_X
  nameObject.y = TEXT_Y_OFFSET
  l2.makeResizable(nameObject)

  const scoreText = new PIXI.Text({ text: String(score), style: { ...textStyle, fontSize: 14 } })
  scoreText.x = SIDEBAR_WIDTH - 40
  scoreText.y = TEXT_Y_OFFSET
  l2.makeResizable(scoreText)

  container.addChild(figure)
  container.addChild(nameObject)
  container.addChild(scoreText)
  rows.push(container)
}

const renderFrame = () => {
  const background = new PIXI.Graphics()
  background
    .rect(BACKGROUND_X, 0, SIDEBAR_WIDTH, GAME_HEIGHT)
    .fill(Color.PANEL)
  background.cacheAsTexture(true)

  state.pixiStage.addChild(background)

  const title = new PIXI.Text({
    text:  'Leaderboard',
    style: { ...textStyle, fill: Color.LIGHT_GRAY, fontSize: 24 },
  })
  title.position.set(BACKGROUND_X + SIDEBAR_WIDTH / 2, TITLE_Y)
  title.anchor.x = 0.5
  l2.makeResizable(title)
  state.pixiStage.addChild(title)
}

const renderContent = () => {
  if (state.mode === TUTORIAL_MODE) {
    return
  }

  rows.splice(0).forEach((row) => {
    row.destroy()
  })

  state
    .players
    .slice()
    .sort((a, b) => b.score - a.score)
    .forEach(({ score, color }, index) => {
      renderRow({
        index,
        name: color.name,
        hex: color.hex,
        score,
      })
    })
}

export default {
  renderFrame,
  renderContent,
}
