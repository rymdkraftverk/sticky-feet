import { useEffect, useState } from 'react'
import MediaQuery from 'react-responsive'
import { Event, Channel } from 'common'
import signaling from 'rkv-signaling'
import getUrlParams from './join/getUrlParams'

import channelConfigs from './config/channels'
import LockerRoom from './join/LockerRoom'
import LockerRoomLoader from './join/LockerRoomLoader'
import GamePlaying from './playing/Main'
import { getLastGameCode, setLastGameCode } from './join/sessionStorage'
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
const TIMEOUT_SECONDS = 20

const AppState = {
  LOCKER_ROOM: 'locker-room',
  GAME_CONNECTING: 'game-connecting',
  GAME: 'game',
}

const getGameCodeFromUrl = () => getUrlParams().code
const writeGameCodeToUrl = (gameCode: string) => {
  window.history.pushState({ gameCode }, '', `?code=${gameCode}`)
}

function App() {
  const [appState, setAppState] = useState(AppState.LOCKER_ROOM)
  const [gameCode, setGameCode] = useState('')
  const [notice, setNotice] = useState<{
    text: string
    type: 'error' | 'warning'
  } | null>(null)
  const [playerColor, setPlayerColor] = useState('')
  const [sendReliable, setSendReliable] = useState<{
    f: (message: object) => void
  }>({
    f: () => {}, // Hack to be able to put a function in state
  })

  useEffect(() => {
    alertIfNoRtc()
    warnIfCellular()
    const codeFromUrl = getGameCodeFromUrl()
    const code = codeFromUrl || getLastGameCode()
    setGameCode(code)

    if (codeFromUrl) {
      join(code)
    }
  }, [])

  const onData = ({
    event,
    payload,
  }: {
    event: string
    payload: { color: string }
  }) => {
    switch (event) {
      case Event.FromGame.YOU_JOINED:
        setAppState(AppState.GAME)
        setPlayerColor(payload.color)
        break
      case Event.FromGame.FULL:
        displayError('Game is full')
        break
      default:
        console.error(`Unexpected event: ${event}`)
    }
  }

  const onJoinClick = () => {
    navigator.vibrate(1) // To trigger accept dialog in firefox
    join(gameCode)
  }

  const join = (code: string) => {
    setAppState(AppState.GAME_CONNECTING)
    setNotice(null)
    setLastGameCode(code)
    setTimeout(checkConnectionTimeout, TIMEOUT_SECONDS * 1000)
    writeGameCodeToUrl(code)
    connectToGame(code)
  }

  const displayError = (message: string) => {
    setAppState(AppState.LOCKER_ROOM)
    setNotice({ text: message, type: 'error' })
  }

  const warnIfCellular = () => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection

    if (connection && connection.type === 'cellular') {
      setNotice({
        text: 'Connect to WiFi for best experience',
        type: 'warning',
      })
    }
  }

  const alertIfNoRtc = () => {
    if (typeof RTCPeerConnection === 'undefined') {
      const message =
        'Unfortunately the game cannot be played in this browser.' +
        'See list of supported browsers here: https://caniuse.com/#search=webrtc'

      // eslint-disable-next-line no-alert
      alert(message)
    }
  }

  const gameCodeChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setGameCode(value.substr(0, 4).toUpperCase())
  }

  const checkConnectionTimeout = () => {
    if (appState === AppState.GAME_CONNECTING) {
      displayError('Connection failed, joining Wi-Fi may help')
    }
  }

  const connectToGame = (code: string) => {
    const onClose = () => {
      displayError('Connection failed')
    }

    signaling
      .runInitiator({
        channelConfigs,
        onClose,
        onData,
        receiverId: code,
        wsAddress: WS_ADDRESS as string,
      })
      .then(send => {
        setSendReliable({
          f: send(Channel.RELIABLE),
        })
      })
      .catch((joinError: { cause?: string }) => {
        const message =
          joinError.cause === 'NOT_FOUND'
            ? `Game with code ${code} not found`
            : undefined

        if (message) {
          displayError(message)
        } else {
          console.error(joinError)
        }
      })
  }

  const appStateComponent = () => {
    switch (appState) {
      case AppState.LOCKER_ROOM:
        return (
          <LockerRoom
            gameCodeChange={gameCodeChange}
            gameCode={gameCode}
            onJoinClick={onJoinClick}
          />
        )
      case AppState.GAME_CONNECTING:
        return <LockerRoomLoader />
      case AppState.GAME:
        return <GamePlaying send={sendReliable.f} playerColor={playerColor} />
      default:
        return null
    }
  }

  return (
    <div>
      {notice && (
        <Toast
          key={notice.text}
          text={notice.text}
          type={notice.type}
          onHide={() => setNotice(null)}
        />
      )}
      <MediaQuery orientation="portrait">
        <TurnPhone />
      </MediaQuery>
      <MediaQuery orientation="landscape">{appStateComponent()}</MediaQuery>
    </div>
  )
}

export default App
