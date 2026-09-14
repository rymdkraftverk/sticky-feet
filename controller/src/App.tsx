import {
  LockerRoom,
  LockerRoomLoader,
  Toast,
  TurnPhone,
} from 'rkv-signaling/screens'
import { useState } from 'react'
import styled from 'styled-components'
import MediaQuery from 'react-responsive'
import { Event, Channel } from 'common'
import { useJoin } from 'rkv-signaling/react'
import { joinButtonStyle } from 'rkv-signaling/screens'

import channelConfigs from './config/channels'
import Button from './join/Button'
import turnPhoneGif from './join/turnPhone.gif'
import turnPhoneSound from './join/key.mp3'
import GamePlaying from './playing/Main'

const noop = () => false

navigator.vibrate =
  navigator.vibrate ||
  navigator.webkitVibrate ||
  navigator.mozVibrate ||
  navigator.msVibrate ||
  noop

const WS_ADDRESS = process.env.REACT_APP_WS_ADDRESS

const JoinButton = styled(Button)`
  ${joinButtonStyle}
`

const App = () => {
  const [playerColor, setPlayerColor] = useState<string | null>(null)

  const onData = ({
    event,
    payload,
  }: {
    event: string
    payload: { color: string }
  }) => {
    switch (event) {
      case Event.FromGame.YOU_JOINED:
        setPlayerColor(payload.color)
        break
      case Event.FromGame.FULL:
        fail('Game is full')
        break
      default:
        console.error(`Unexpected event: ${event}`)
    }
  }

  const {
    status,
    gameCode,
    setGameCode,
    notice,
    dismissNotice,
    join,
    fail,
    send,
  } = useJoin({
    wsAddress: WS_ADDRESS as string,
    channelConfigs,
    onData,
  })

  const gameCodeChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setGameCode(value)
  }

  const screen = () => {
    if (status === 'lobby') {
      return (
        <LockerRoom
          gameCodeChange={gameCodeChange}
          gameCode={gameCode}
          onJoinClick={join}
          button={JoinButton}
        />
      )
    }

    if (status === 'connected' && playerColor) {
      return (
        <GamePlaying
          send={(message: object) => send(Channel.RELIABLE, message)}
          playerColor={playerColor}
        />
      )
    }

    return <LockerRoomLoader />
  }

  return (
    <div>
      {notice && (
        <Toast
          key={notice.text}
          text={notice.text}
          type={notice.type}
          onHide={dismissNotice}
        />
      )}
      <MediaQuery orientation="portrait">
        <TurnPhone gif={turnPhoneGif} sound={turnPhoneSound} />
      </MediaQuery>
      <MediaQuery orientation="landscape">{screen()}</MediaQuery>
    </div>
  )
}

export default App
