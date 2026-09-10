import PropTypes from 'prop-types'
import styled from 'styled-components'
import FullHeight from '../FullHeight'
import IOSDisableDoubleTap from '../util/IOSDisableDoubleTap'
import ScrollLock from '../util/ScrollLock'
import Button from './Button'

const PLACEHOLDER = 'Code'

const Container = styled.div`
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
const GameJoinButton = styled(Button)`
  color: #4085af;
  opacity: ${({ disabled }) => (disabled ? '0.2' : '1')};
`

// * This does not seem to work on iOS
const onFocus = e => {
  e.target.placeholder = ''
  e.target.select()
}

const onBlur = e => {
  e.target.placeholder = PLACEHOLDER
}

function LockerRoom(props) {
  const isSubmit = pressed => gameCodeFilled() && pressed === 'Enter'
  const gameCodeFilled = () => props.gameCode.length === 4
  const onKeyPress = e => {
    if (isSubmit(e.key)) props.onJoinClick()
  }

  return (
    <IOSDisableDoubleTap>
      <ScrollLock />
      <FullHeight>
        <Container style={{ height: '50dvh' }}>
          <ContainerColumn>
            <GameCodeInput
              type="text"
              value={props.gameCode}
              onChange={props.gameCodeChange}
              placeholder={PLACEHOLDER}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyPress={onKeyPress}
              spellCheck="false"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </ContainerColumn>
          <ContainerColumn>
            <GameJoinButton
              disabled={!gameCodeFilled()}
              onClick={props.onJoinClick}
            >
              Join
            </GameJoinButton>
          </ContainerColumn>
        </Container>
      </FullHeight>
    </IOSDisableDoubleTap>
  )
}

LockerRoom.propTypes = {
  gameCode: PropTypes.string.isRequired,
  onJoinClick: PropTypes.func.isRequired,
  gameCodeChange: PropTypes.func.isRequired,
}

export default LockerRoom
