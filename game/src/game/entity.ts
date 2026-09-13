import * as Matter from 'matter-js'
import * as l2 from 'l2'

import state from './state'
import type { Entity } from './types'

const syncBehaviorId = (entityId: string) => `sync_${entityId}`

export const remove = ({
  id,
  sprite,
  body,
  behaviors,
}: Entity) => {
  l2.removeBehavior(syncBehaviorId(id))

  Object
    .values(behaviors)
    .forEach(l2.removeBehavior)

  l2.once(() => {
    sprite.destroy({ children: true })
    Matter.World.remove(state.matterWorld, body)
  })
}

export const add = ({ id, sprite, body }: Entity) => {
  state.pixiStage.addChild(sprite)
  Matter.World.add(state.matterWorld, [body])

  // Sync the movement of sprite and physical body
  l2.repeat(() => {
     
    sprite.position.x = body.position.x
    sprite.position.y = body.position.y
     
  }, 1, { id: syncBehaviorId(id) })
}
