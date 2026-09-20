import { effect, track } from 'l2/sound'

import ui04 from '../asset/sound/UI04.mp3'
import music from '../asset/sound/music.mp3'
import projectileShoot from '../asset/sound/projectile_shoot.wav'
import projectileHit from '../asset/sound/projectile_hit.wav'
import kill from '../asset/sound/kill.wav'
import jump from '../asset/sound/jump.wav'

export const Track = {
  MUSIC: track({ src: music, volume: 0.6 }),
}

export default {
  UI_04: effect({ src: ui04, volume: 0.8 }),
  PROJECTILE_SHOOT: effect({ src: projectileShoot, volume: 0.6 }),
  PROJECTILE_HIT: effect({ src: projectileHit, volume: 0.6 }),
  KILL: effect({ src: kill, volume: 0.6 }),
  JUMP: effect({ src: jump, volume: 0.6 }),
}
