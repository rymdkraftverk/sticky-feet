import * as l1 from 'l1'
import * as Matter from 'matter-js'

export default (pixiStage, matterEngine, { sprite, body }) => {
  pixiStage.addChild(sprite)
  Matter.World.add(matterEngine, [body])

  // Sync the movement of sprite and physical body
  l1.addBehavior({
    onUpdate: () => {
      /* eslint-disable no-param-reassign */
      sprite.position.x = body.position.x
      sprite.position.y = body.position.y
      /* eslint-enable no-param-reassign */
    },
  })
}
