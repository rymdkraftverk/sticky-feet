import { Howl } from 'howler'
import * as R from 'ramda'

// Typescript erroneously reports this as an error
// @ts-ignore
import ui04 from '../asset/sound/UI04.mp3'

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
  })

// How to use
// Sound.SWORD_01.play()
