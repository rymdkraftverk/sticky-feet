import React from 'react'
import PropTypes from 'prop-types'
import { Event } from 'common'
import styled from 'styled-components/macro'
import Div100vh from 'react-div-100vh'
import Button from '../join/Button'

const Container = styled(Div100vh)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const JumpButton = styled(Button)`
  border: 0.1em solid;
  font-size: 8vw;
`

const GamePlaying = ({ send }) => {
  return (
    <Container>
      <JumpButton onMouseDown={() => send({ event: Event.ToGame.JUMP })}>
        Jump
      </JumpButton>
    </Container>
  )
}

GamePlaying.propTypes = {
  send: PropTypes.func,
}

export default GamePlaying
