import * as l2 from 'l2'
import * as PIXI from 'pixi.js'
import playerRepository from './player/repository'
import state from './state'
import {
  add,
  fromPolar,
} from './linearAlgebra'

const create = () => {
  const scope = new PIXI.Sprite()
  scope.anchor.set(0.5)
  scope.visible = false
  state.pixiStage.addChild(scope)
  return scope
}

const updatePosition = (id: string, { distance }: { distance: number }) => {
  const player = playerRepository.find(id)

  const { body: { position: { x, y } } } = player

  const { x: scopeX, y: scopeY } = add(
    { x, y },
    fromPolar(player.scope.rotation, distance),
  )

  player.scope.position.set(scopeX, scopeY)
}

const aim = (id: string, { angle, distance }: { angle: number, distance: number }) => {
  const player = playerRepository.find(id)
  const {
    cooldowns,
    scope,
  } = player

  const texture = cooldowns.projectile ? 'aim-cooldown' : 'aim-ready'
  scope.texture = l2.getTexture(texture)

  scope.visible = true

  scope.rotation = angle
  updatePosition(id, { distance })
  scope.distance = distance

  player.scope = scope
}

const reset = (id: string) => {
  const { scope } = playerRepository.find(id)
  scope.visible = false
}

export default {
  aim,
  create,
  reset,
  updatePosition,
}
