import * as PIXI from 'pixi.js'
import * as l1 from 'l1'
import playerRepository from './player/repository'

const create = (pixiStage) => {
  const scope = new PIXI.Sprite(l1.getTexture('arrow/arrow-green'))
  scope.anchor.set(0.5)
  scope.visible = false
  pixiStage.addChild(scope)
  return scope
}

const vectorTip = ({ x: originX, y: originY }, angle, distance) => ({
  x: originX + distance * Math.cos(angle),
  y: originY + distance * Math.sin(angle),
})

const aim = (id, { angle, distance }) => {
  const player = playerRepository.find(id)
  const {
    body: {
      position: {
        x,
        y,
      },
    },
    scope,
  } = player

  scope.visible = true

  scope.rotation = angle
  scope.position = vectorTip(
    { x, y },
    angle,
    distance,
  )

  player.scope = scope
}

const reset = (id) => {
  const { scope } = playerRepository.find(id)
  scope.visible = false
}

export default {
  aim,
  create,
  reset,
}
