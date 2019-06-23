import { Channel } from 'common'

// configuration explanation:
// https://jameshfisher.com/2017/01/17/webrtc-datachannel-reliability.html
export default [
  {
    // "tcpLike"
    name: Channel.RELIABLE,
    config: {
      ordered: true,
    },
  },
]
