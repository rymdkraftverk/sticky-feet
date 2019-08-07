import * as l1 from 'l1'
import * as Matter from 'matter-js'

import { DOME_X, DOME_Y } from './constant'

const syncBehaviorId = entityId => `sync_${entityId}`

export const remove = (matterWorld, { id, sprite, body }) => {
  l1.remove(syncBehaviorId(id))
  sprite.destroy()
  Matter.World.remove(matterWorld, body)
}

export const add = (pixiStage, matterWorld, { id, sprite, body }) => {
  pixiStage.addChild(sprite)
  Matter.World.add(matterWorld, [body])

  // Sync the movement of sprite and physical body
  const behavior = l1.repeat(() => {
    /* eslint-disable no-param-reassign */
    sprite.position.x = body.position.x
    sprite.position.y = body.position.y
    sprite.rotation = Math.atan2(body.position.y - DOME_Y, body.position.x - DOME_X) - Math.PI / 2
    /* eslint-enable no-param-reassign */
  })

  behavior.id = syncBehaviorId(id)
}
