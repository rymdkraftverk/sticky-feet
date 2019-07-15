import React from 'react'
import PropTypes from 'prop-types'

const GamePlaying = ({ send }) => {
  return <div onMouseDown={() => send({ event: 'jump' })}>Game Playing!</div>
}

GamePlaying.propTypes = {
  send: PropTypes.func,
}

export default GamePlaying
