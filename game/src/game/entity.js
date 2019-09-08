import * as l1 from 'l1'
import * as Matter from 'matter-js'

import state from './state'

const syncBehaviorId = entityId => `sync_${entityId}`

export const remove = ({
  id,
  sprite,
  body,
  behaviors,
}) => {
  l1.remove(syncBehaviorId(id))

  Object
    .values(behaviors)
    .forEach(l1.remove)

  l1.once(() => {
    sprite.destroy()
    Matter.World.remove(state.matterWorld, body)
  })
}

export const add = ({ id, sprite, body }) => {
  state.pixiStage.addChild(sprite)
  Matter.World.add(state.matterWorld, [body])

  // Sync the movement of sprite and physical body
  const behavior = l1.repeat(() => {
    /* eslint-disable no-param-reassign */
    sprite.position.x = body.position.x
    sprite.position.y = body.position.y
    /* eslint-enable no-param-reassign */
  })

  behavior.id = syncBehaviorId(id)
}
