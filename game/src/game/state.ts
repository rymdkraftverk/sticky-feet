import type * as Matter from 'matter-js'
import type * as PIXI from 'pixi.js'
import { Colors } from 'common'
import getUrlParams from '../getUrlParams'
import { DEFAULT_LAP_TIME } from './constant'
import type { Player, Projectile } from './types'

const namesInReversedOrder = Colors.map(({ name }) => name).reverse()

const state = {
  matterWorld: null as unknown as Matter.World,
  pixiStage: null as unknown as PIXI.Container,
  players: [] as Player[],
  projectiles: [] as Projectile[],
  availableColors: namesInReversedOrder,
  mode: getUrlParams().mode,
  lapTime: DEFAULT_LAP_TIME,
}

export default state
