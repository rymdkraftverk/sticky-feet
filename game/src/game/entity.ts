import * as Matter from 'matter-js'
import * as l1 from '../l1'

import state from './state'
import type { Entity } from './types'

const syncBehaviorId = (entityId: string) => `sync_${entityId}`

export const remove = ({
  id,
  sprite,
  body,
  behaviors,
}: Entity) => {
  l1.remove(syncBehaviorId(id))

  Object
    .values(behaviors)
    .forEach(l1.remove)

  l1.once(() => {
    sprite.destroy()
    Matter.World.remove(state.matterWorld, body)
  })
}

export const add = ({ id, sprite, body }: Entity) => {
  state.pixiStage.addChild(sprite)
  Matter.World.add(state.matterWorld, [body])

  // Sync the movement of sprite and physical body
  const behavior = l1.repeat(() => {
     
    sprite.position.x = body.position.x
    sprite.position.y = body.position.y
     
  })

  behavior.id = syncBehaviorId(id)
}
