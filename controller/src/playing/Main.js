import React, { useState } from 'react'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import { Event } from 'common'
import styled from 'styled-components/macro'
import Div100vh from 'react-div-100vh'
import Button from '../join/Button'

const Container = styled(({ playerColor, ...rest }) => <Div100vh {...rest} />)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${R.prop('playerColor')};
`

const JumpButton = styled(Button)`
  border: 0.1em solid;
  font-size: 8vw;
`

const distance = ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

const angle = ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
  Math.atan2(y2 - y1, x2 - x1)

const touchEventPosition = ({ touches: [{ clientX: x, clientY: y }] }) => ({
  x,
  y,
})

const GamePlaying = ({ send, playerColor }) => {
  const [originPosition, setOriginPosition] = useState(null)

  const sendDrag = position => {
    send({
      event: Event.ToGame.DRAG,
      payload: {
        angle: angle(originPosition, position),
        distance: distance(originPosition, position),
      },
    })
  }

  const sendDragEnd = () => {
    send({ event: Event.ToGame.DRAG_END })
  }

  const sendJump = () => {
    send({ event: Event.ToGame.JUMP })
  }

  return (
    <Container
      playerColor={playerColor}
      onTouchStart={R.pipe(
        touchEventPosition,
        setOriginPosition,
      )}
      onTouchMove={R.pipe(
        touchEventPosition,
        sendDrag,
      )}
      onTouchEnd={sendDragEnd}
    >
      <JumpButton onTouchStart={sendJump}>Jump</JumpButton>
    </Container>
  )
}

GamePlaying.propTypes = {
  send: PropTypes.func,
  playerColor: PropTypes.string.isRequired,
}

export default GamePlaying
