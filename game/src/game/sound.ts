import { Howl } from 'howler'

import ui04 from '../asset/sound/UI04.mp3'
import music from '../asset/sound/music.mp3'
import projectileShoot from '../asset/sound/projectile_shoot.wav'
import projectileHit from '../asset/sound/projectile_hit.wav'
import kill from '../asset/sound/kill.wav'
import jump from '../asset/sound/jump.wav'

const sound = ({ src, ...rest }: { src: string, volume: number, loop?: boolean }) => {
  const soundFile = new Howl({
    src: [src],
    preload: true,
    ...rest,
  })

  return soundFile
}

export default {
  UI_04: sound({ src: ui04, volume: 0.8 }),
  PROJECTILE_SHOOT: sound({ src: projectileShoot, volume: 0.6 }),
  PROJECTILE_HIT: sound({ src: projectileHit, volume: 0.6 }),
  KILL: sound({ src: kill, volume: 0.6 }),
  JUMP: sound({ src: jump, volume: 0.6 }),
  MUSIC: sound({ src: music, volume: 0.6, loop: true }),
}

// How to use
// Sound.SWORD_01.play()
