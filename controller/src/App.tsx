import { useState } from 'react'
import MediaQuery from 'react-responsive'
import { Event, Channel } from 'common'
import { useJoin } from 'rkv-signaling/react'

import channelConfigs from './config/channels'
import LockerRoom from './join/LockerRoom'
import LockerRoomLoader from './join/LockerRoomLoader'
import GamePlaying from './playing/Main'
import TurnPhone from './join/TurnPhone'
import Toast from './Toast'

const noop = () => false

navigator.vibrate =
  navigator.vibrate ||
  navigator.webkitVibrate ||
  navigator.mozVibrate ||
  navigator.msVibrate ||
  noop

const WS_ADDRESS = process.env.REACT_APP_WS_ADDRESS

function App() {
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
        <TurnPhone />
      </MediaQuery>
      <MediaQuery orientation="landscape">{screen()}</MediaQuery>
    </div>
  )
}

export default App
