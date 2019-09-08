import * as PIXI from 'pixi.js'
import * as l1 from 'l1'
import playerRepository from './player/repository'
import state from './state'
import {
  add,
  fromPolar,
} from './linearAlgebra'

const create = () => {
  const scope = new PIXI.Sprite(l1.getTexture('arrow/arrow-green'))
  scope.anchor.set(0.5)
  scope.visible = false
  state.pixiStage.addChild(scope)
  return scope
}

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
  scope.position = add(
    { x, y },
    fromPolar(angle, distance),
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
