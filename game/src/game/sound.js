import { Howl } from 'howler'
import * as R from 'ramda'

// Typescript erroneously reports this as an error
// Probably because importing a sound file like this is parcel bundler specific
// @ts-ignore
import ui04 from '../asset/sound/UI04.mp3'
// @ts-ignore
import music from '../asset/sound/music.mp3'
// @ts-ignore
import projectileShoot from '../asset/sound/projectile_shoot.wav'
// @ts-ignore
import projectileHit from '../asset/sound/projectile_hit.wav'
// @ts-ignore
import kill from '../asset/sound/kill.wav'
// @ts-ignore
import jump from '../asset/sound/jump.wav'

const sound = ({ src, ...rest }) => {
  const soundFile = new Howl({
    src: [src],
    preload: true,
    ...rest,
  })

  return soundFile
}

export default R.map(sound,
  {
    UI_04: { src: ui04, volume: 0.8 },
    PROJECTILE_SHOOT: { src: projectileShoot, volume: 0.6 },
    PROJECTILE_HIT: { src: projectileHit, volume: 0.6 },
    KILL: { src: kill, volume: 0.6 },
    JUMP: { src: jump, volume: 0.6 },
    MUSIC: { src: music, volume: 0.6, loop: true },
  })

// How to use
// Sound.SWORD_01.play()
