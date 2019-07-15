import React from 'react'
import PropTypes from 'prop-types'
import { Event } from 'common'
import styled from 'styled-components/macro'
import Div100vh from 'react-div-100vh'

const Container = styled(Div100vh)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Button = styled.div`
  border: 0.1em solid;
  font-size: 8vw;
`

const GamePlaying = ({ send }) => {
  return (
    <Container>
      <Button onMouseDown={() => send({ event: Event.ToGame.JUMP })}>
        Jump
      </Button>
    </Container>
  )
}

GamePlaying.propTypes = {
  send: PropTypes.func,
}

export default GamePlaying
