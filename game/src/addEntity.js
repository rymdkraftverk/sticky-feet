import * as l1 from 'l1'
import * as Matter from 'matter-js'
import { DOME_X, DOME_Y } from './constant'

export default (pixiStage, matterWorld, { id, sprite, body }) => {
  pixiStage.addChild(sprite)
  Matter.World.add(matterWorld, [body])

  // Sync the movement of sprite and physical body
  const behavior = l1.repeat(() => {
    /* eslint-disable no-param-reassign */
    sprite.position.x = body.position.x
    sprite.position.y = body.position.y
    // TODO: Axel: Fix rotation
    sprite.rotation = -Math.atan(body.position.y - DOME_Y / body.position.x - DOME_X) - Math.PI / 2
    /* eslint-enable no-param-reassign */
  })

  behavior.id = `sync_${id}`
}
