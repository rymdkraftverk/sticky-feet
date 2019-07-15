import React from 'react'
import PropTypes from 'prop-types'
import { Event } from 'common'

const GamePlaying = ({ send }) => {
  return (
    <div onMouseDown={() => send({ event: Event.ToGame.JUMP })}>
      Game Playing!
    </div>
  )
}

GamePlaying.propTypes = {
  send: PropTypes.func,
}

export default GamePlaying
