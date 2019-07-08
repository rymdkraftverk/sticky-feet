import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { notify } from 'react-notify-toast'
import styled from 'styled-components/macro'
import IOSDisableDoubleTap from './IOSDisableDoubleTap'
import Div100vh from 'react-div-100vh'
import ScrollLock from './ScrollLock'

const PLACEHOLDER = 'Code'

const Container = styled(Div100vh)`
  display: flex;
`

const ContainerColumn = styled.div`
  width: 50vw;
  display: flex;
  align-items: center;
  justify-content: center;
`

const GameCodeInput = styled.input`
  letter-spacing: 0.5em;
  font-size: 5vw;
  text-align: center;
  text-decoration: none;
  font-family: 'patchy-robots';
  outline: none;
  border: 0;
  background: transparent;
  border-bottom: 3px solid #4085af;
  width: 70%;
  caret-color: #4085af;
  color: #4085af;
`
const GameJoinButton = styled.button`
  color: #4085af;
  opacity: ${({ disabled }) => (disabled ? '0.2' : '1')};
`

const connection =
  navigator.connection || navigator.mozConnection || navigator.webkitConnection

const isMobile = connection && connection.type === 'cellular'

const onFocus = e => {
  e.target.placeholder = ''
  e.target.select()
}

const onBlur = e => {
  e.target.placeholder = PLACEHOLDER
}

const LockerRoom = props => {
  const isSubmit = pressed => gameCodeFilled() && pressed === 'Enter'
  const gameCodeFilled = () => props.gameCode.length === 4
  const onKeyPress = e => {
    if (isSubmit(e.key)) props.onJoinClick()
  }

  useEffect(() => {
    if (isMobile) {
      notify.show('Connect to WiFi for best experience', 'warning')
    }
  }, [])

  useEffect(() => {
    if (props.error) {
      notify.show(props.error, 'error')
    }
  }, [props.error])

  return (
    <IOSDisableDoubleTap>
      <ScrollLock />
      <Div100vh>
        <Container style={{ height: '50rvh' }}>
          <ContainerColumn>
            <GameCodeInput
              type="text"
              value={props.gameCode}
              onChange={props.gameCodeChange}
              placeholder={PLACEHOLDER}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyPress={onKeyPress}
              className="game-join-input"
              spellCheck="false"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </ContainerColumn>
          <ContainerColumn>
            {
              <GameJoinButton
                disabled={!gameCodeFilled()}
                onClick={props.onJoinClick}
              >
                Join
              </GameJoinButton>
            }
          </ContainerColumn>
        </Container>
      </Div100vh>
    </IOSDisableDoubleTap>
  )
}

LockerRoom.propTypes = {
  error: PropTypes.string,
  gameCode: PropTypes.string.isRequired,
  onJoinClick: PropTypes.func.isRequired,
  gameCodeChange: PropTypes.func.isRequired,
}

LockerRoom.defaultProps = {
  error: null,
}

export default LockerRoom
