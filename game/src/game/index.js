import * as PIXI from 'pixi.js'
import * as l1 from 'l1'
import * as Matter from 'matter-js'
import signaling from 'rkv-signaling'

import { Event, Colors, Channel } from '../../../common'
import Sound from './sound'
import leaderboard, { renderLeaderboard } from './leaderboard'
import http from './http'
import state from './state'
import stage from './stage'
import jump from './jump'
import brake from './brake'
import shake from './shake'
import scope from './scope'
import createPlayer from './player/create'
import removePlayer from './player/remove'
import playerRepository from './player/repository'
import qrCode from './qrCode'
import createProjectile from './projectile/create'
import cooldown from './cooldown'
import collider from './collider'
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  PROJECTILE_COOLDOWN,
  SHAKE_COOLDOWN,
} from './constant'
import debugMatter from './util/debugMatter'

import * as Color from './constant/color'

// Hack to make Matter.Bodies.fromVertices work
window['decomp'] = require('poly-decomp')

const DEBUG_MATTER = false

const WS_ADDRESS = process.env.WS_ADDRESS || 'ws://localhost:3000'
const CONTROLLER_HOST = process.env.CONTROLLER_HOST || 'localhost:4001'

// Enable pixel perfect rendering
// There's a bug in typescript flagging this as an error.
// TODO: Remove ts-ignore once typescript is updated
// @ts-ignore
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

// There's a bug in typescript flagging this as an error.
// TODO: Remove ts-ignore once typescript is updated
// @ts-ignore
const app = new PIXI.Application({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  antialias: true,
  // TODO: Enable when possible (background image exists)
  // clearBeforeRender: false,
  backgroundColor: l1.fromHex(Color.LIGHT_GRAY),
})
// Enables setting zIndex on the children of stage
app.stage.sortableChildren = true
state.pixiStage = app.stage

document
  .getElementById('game')
  .appendChild(app.view)

l1.init(app, {
  // debug: process.env.NODE_ENV === 'development',
  // logging: process.env.NODE_ENV === 'development',
})

const engine = Matter.Engine.create()
state.matterWorld = engine.world

// Remove default gravity
state.matterWorld.gravity.y = 0

app.ticker.add(() => {
  Matter.Engine.update(engine)
})

Matter.Events.on(engine, 'collisionStart', collider)

app.loader.add('spritesheet/main.json')
app.loader.add('spritesheet/spritesheet.json')

Sound.MUSIC.play()

const onPlayerData = id => (message) => {
  const { event, payload } = message

  switch (event) {
    case Event.ToGame.BRAKE:
      brake.start(id)
      break
    case Event.ToGame.JUMP:
      jump(id)
      brake.stop(id)
      break
    case Event.ToGame.SHAKE:
      cooldown(
        id,
        {
          id: 'shake',
          duration: SHAKE_COOLDOWN,
          ability: () => {
            shake(id)
          },
        },
      )
      break
    case Event.ToGame.DRAG:
      scope.aim(
        id,
        payload,
      )
      break
    case Event.ToGame.DRAG_END:
      scope.reset(id)
      cooldown(
        id,
        {
          id: 'projectile',
          duration: PROJECTILE_COOLDOWN,
          ability: () => {
            createProjectile(
              id,
              payload,
            )
          },
        },
      )
      break
    default:
      console.warn(`Unhandled event: ${event}`)
  }
}

const morePlayersAllowed = () => playerRepository.count() < Colors.length

const onPlayerJoin = ({
  id,
  setOnData,
  send,
  close,
}) => {
  if (!morePlayersAllowed()) {
    send(Channel.RELIABLE, { event: Event.FromGame.FULL })
    close()
    return
  }

  setOnData(onPlayerData(id))

  const {
    color: {
      hex,
    },
  } = createPlayer(id)

  Sound.UI_04.play()

  send(Channel.RELIABLE, {
    event: Event.FromGame.YOU_JOINED,
    payload: {
      id,
      color: hex,
    },
  })
}

const createBot = (idSuffix = Date.now().toString()) => {
  createPlayer(`BOT_${idSuffix}`)
}

// Experimental API's are not supported by typescript
// @ts-ignore
document.fonts.load('10pt "patchy-robots"')
  .then(() => {
    app.loader.load(() => {
      http.createGame()
        .then(({ gameCode }) => {
          console.log(`[Game created] ${gameCode}`)

          signaling.runReceiver({
            wsAddress: WS_ADDRESS,
            receiverId: gameCode,
            onInitiatorJoin: onPlayerJoin,
            onInitiatorLeave: removePlayer,
          })

          qrCode.display(CONTROLLER_HOST, gameCode)

          stage(gameCode)
          createBot('DEFAULT')
          leaderboard()

          // Not sure why this reported as an error
          // @ts-ignore
          renderLeaderboard(state.players)
        })
    })
  })
  .catch(() => {
    console.error('Unable to load font')
  })

if (DEBUG_MATTER) {
  // This is incorrectly marked as an error by tsc
  // @ts-ignore
  const gfx = new PIXI.Graphics()
  gfx.zIndex = 10000
  app.stage.addChild(gfx)

  l1.repeat(() => {
    debugMatter(
      Matter.Composite.allBodies(engine.world),
      gfx,
      { color: l1.fromHex(Color.GREEN) },
    )
  })
}

const start = () => {
  app.ticker.start()
}

const stop = () => {
  app.ticker.stop()
}

const resizeGame = () => {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  l1.resize(screenWidth, screenHeight)
}
resizeGame()
window.addEventListener('resize', resizeGame)

window['debug'] = {
  ...window['debug'],
  // Add console commands here
  createBot,
  start,
  stop,
  state,
  logging: false,
}
