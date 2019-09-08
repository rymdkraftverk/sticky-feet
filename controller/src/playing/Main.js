import React, { useState } from 'react'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import { Event } from 'common'
import styled from 'styled-components/macro'
import Div100vh from 'react-div-100vh'
import Button from '../join/Button'
import IOSDisableDoubleTap from '../util/IOSDisableDoubleTap'
import ScrollLock from '../util/ScrollLock'
import useShake from '../useShake'

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
  const [position, setPosition] = useState(null)

  useShake(() => {
    send({ event: Event.ToGame.SHAKE })
  })

  const sendDrag = pos => {
    setPosition(pos)
    send({
      event: Event.ToGame.DRAG,
      payload: {
        angle: angle(originPosition, pos),
        distance: distance(originPosition, pos),
      },
    })
  }

  const sendDragEnd = () => {
    if (!originPosition || !position) return

    send({
      event: Event.ToGame.DRAG_END,
      payload: {
        angle: angle(originPosition, position),
      },
    })

    setOriginPosition(null)
    setPosition(null)
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
      onTouchEnd={() => {
        sendDragEnd()
      }}
    >
      <IOSDisableDoubleTap>
        <ScrollLock />
        <JumpButton onTouchStart={sendJump}>Jump</JumpButton>
      </IOSDisableDoubleTap>
    </Container>
  )
}

GamePlaying.propTypes = {
  send: PropTypes.func,
  playerColor: PropTypes.string.isRequired,
}

export default GamePlaying
