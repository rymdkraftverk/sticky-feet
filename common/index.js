export const Channel = {
  RELIABLE: 'reliable',
}

export const Event = {
  FromGame: {
    YOU_JOINED: 'you.joined',
  },
  ToGame: {
    JUMP: 'jump',
    DRAG: 'drag',
    DRAG_END: 'drag.end',
  }
}

export const Colors = [
  // NOTE: Hex codes not synced with sprites
  {
    name: 'red',
    hex: '#FF0000',
  },
  {
    name: 'orange',
    hex: '#FFA500',
  },
  {
    name: 'yellow',
    hex: '#FFFF00',
  },
  {
    name: 'green',
    hex: '#008000',
  },
]
