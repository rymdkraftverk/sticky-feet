import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js'
import decomp from 'poly-decomp'
import { type Initiator } from 'rkv-signaling'
import { host, showQrCode } from 'rkv-signaling/game'
import * as Sentry from '@sentry/browser'

import { Event, Channel } from 'common'
import * as l2 from 'l2'
import { playTrack } from 'l2/sound'
import { Track } from './sound'
import input from './input'
import join, { hasRoom } from './player/join'
import leave from './player/leave'
import * as bot from './bot'
import botButtons from './botButtons'
import leaderboard from './leaderboard'
import state from './state'
import stage from './stage'
import collider from './collider'
import {
  GAME_HEIGHT,
  GAME_WIDTH,
} from './constant'
import debugMatter from './util/debugMatter'
import setLapTime from './setLapTime'
import * as powerup from './powerup'
import * as Color from './constant/color'

// Hack to make Matter.Bodies.fromVertices work
window.decomp = decomp

const DEBUG_MATTER = false

const WS_ADDRESS = process.env.WS_ADDRESS || 'ws://localhost:3000'
const HTTP_ADDRESS = process.env.HTTP_ADDRESS || 'http://localhost:3000'
const CONTROLLER_HOST = process.env.CONTROLLER_HOST || 'localhost:4001'

PIXI.TextureStyle.defaultOptions.scaleMode = 'nearest'

const engine = Matter.Engine.create()
state.matterWorld = engine.world

// Remove default gravity
state.matterWorld.gravity.y = 0

Matter.Events.on(engine, 'collisionStart', collider)

playTrack(Track.MUSIC)

const onPlayerJoin = ({
  id,
  setOnData,
  send,
  close,
}: Initiator) => {
  if (!hasRoom()) {
    send(Channel.RELIABLE, { event: Event.FromGame.FULL })
    close()
    return
  }

  setOnData(input(id))

  const {
    color: {
      hex,
    },
  } = join(id, 'astronaut')

  send(Channel.RELIABLE, {
    event: Event.FromGame.YOU_JOINED,
    payload: {
      id,
      color: hex,
    },
  })
}

const start = () => {
  l2.getApp().ticker.start()
}

const stop = () => {
  l2.getApp().ticker.stop()
}

window.debug = {
  ...window.debug,
  // Add console commands here
  createBot: bot.add,
  removeBot: bot.remove,
  start,
  stop,
  state,
  logging: false,
  behaviors: () => l2.getAllBehaviors().map(b => b.id),
  setLapTime,
  spawnPowerup: powerup.spawn,
}

const boot = async () => {
  const gameElement = document.getElementById('game')

  if (!gameElement) {
    throw new Error('Found no #game element to mount the canvas into')
  }

  Sentry.init({ dsn: process.env.SENTRY_DSN })

  const app = await l2.boot({
    mount:     gameElement,
    onError:   (error: Error) => {
      Sentry.captureException(error)
    },
    width:     GAME_WIDTH,
    height:    GAME_HEIGHT,
    antialias: true,
    background: Color.SPACE,
  })
  // Enables setting zIndex on the children of stage
  app.stage.sortableChildren = true
  state.pixiStage = app.stage

  if (DEBUG_MATTER) {
    const gfx = new PIXI.Graphics()
    gfx.zIndex = 10000
    app.stage.addChild(gfx)

    l2.repeat(() => {
      debugMatter(
        Matter.Composite.allBodies(engine.world),
        gfx,
        { color: Color.GREEN },
      )
    })
  }

  app.ticker.add(() => {
    Matter.Engine.update(engine)
  })

  l2.fitToWindow()

  await document.fonts.load('10pt "patchy-robots"')

  l2.useSpritesheets([await PIXI.Assets.load('spritesheet/main.json')])

  const gameCode = await host({
    httpAddress:      HTTP_ADDRESS,
    wsAddress:        WS_ADDRESS,
    onInitiatorJoin:  onPlayerJoin,
    onInitiatorLeave: leave,
  })

  console.log(`[Game created] ${gameCode}`)

  showQrCode({
    controllerHost: CONTROLLER_HOST,
    gameCode,
    mount:          gameElement,
  })

  stage(gameCode)
  leaderboard.renderFrame()
  botButtons()
  powerup.startSpawning()
  bot.add('DEFAULT')
}

boot()
