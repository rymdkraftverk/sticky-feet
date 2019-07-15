import React, { useEffect, useState } from 'react'
import Notifications from 'react-notify-toast'
import MediaQuery from 'react-responsive'
import { Event, Channel } from 'common'
import getUrlParams from './join/getUrlParams'
import signaling from 'rkv-signaling'

import channelConfigs from './config/channels'
import LockerRoom from './join/LockerRoom'
import LockerRoomLoader from './join/LockerRoomLoader'
import GamePlaying from './playing/Main'
import { getLastGameCode, setLastGameCode } from './join/sessionStorage'
import TurnPhone from './join/TurnPhone'

const { error: logError } = console

const { REACT_APP_WS_ADDRESS: WS_ADDRESS } = process.env
const TIMEOUT_SECONDS = 20

const AppState = {
  LOCKER_ROOM: 'locker-room',
  GAME_CONNECTING: 'game-connecting',
  GAME: 'game',
}

const getGameCodeFromUrl = () => getUrlParams(window.location.search).code
const writeGameCodeToUrl = gameCode => {
  window.history.pushState({ gameCode }, '', `?code=${gameCode}`)
}

const eventState = ({ event, payload }) => {
  switch (event) {
    case Event.YOU_JOINED:
      return AppState.GAME
    default:
      return null
  }
}

const App = props => {
  const [appState, setAppState] = useState(AppState.LOCKER_ROOM)
  const [gameCode, setGameCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    alertIfNoRtc()
    const codeFromUrl = getGameCodeFromUrl()
    const code = codeFromUrl || getLastGameCode()
    setGameCode(code)

    if (codeFromUrl) {
      join(code)
    }
  }, [])

  const onData = message => {
    const state = eventState(message)

    if (!state) {
      logError(`Unexpected event in message: ${message}`)
      return
    }

    setAppState(state)
  }

  const onJoinClick = () => {
    navigator.vibrate(1) // To trigger accept dialog in firefox
    join(gameCode)
  }

  const join = code => {
    setAppState(AppState.GAME_CONNECTING)
    setError('')
    setLastGameCode(code)
    setTimeout(checkConnectionTimeout, TIMEOUT_SECONDS * 1000)
    writeGameCodeToUrl(code)
    connectToGame(code)
  }

  const displayError = message => {
    setAppState(AppState.LOCKER_ROOM)
    setError(message)
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

  const gameCodeChange = ({ target: { value } }) => {
    setGameCode(value.substr(0, 4).toUpperCase())
  }

  const checkConnectionTimeout = () => {
    if (appState === AppState.GAME_CONNECTING) {
      displayError('Connection failed, joining Wi-Fi may help')
    }
  }

  const connectToGame = code => {
    const onClose = () => {
      displayError('Connection failed')
    }

    signaling
      .runInitiator({
        channelConfigs,
        onClose,
        onData: onData,
        receiverId: code,
        wsAddress: WS_ADDRESS,
      })
      .then(send => {
        send(Channel.RELIABLE, 'Connected')
      })
      .catch(error => {
        const message = {
          NOT_FOUND: `Game with code ${code} not found`,
        }[error.cause]

        if (message) {
          displayError(message)
        } else {
          logError(error)
        }
      })
  }

  const clearError = () => {
    setError('')
  }

  const appStateComponent = () => {
    switch (appState) {
      case AppState.LOCKER_ROOM:
        return (
          <LockerRoom
            clearError={clearError}
            error={error}
            gameCodeChange={gameCodeChange}
            gameCode={gameCode}
            onJoinClick={onJoinClick}
          />
        )
      case AppState.GAME_CONNECTING:
        return <LockerRoomLoader />
      case AppState.GAME:
        return <GamePlaying />
      default:
        return null
    }
  }

  return (
    <div>
      <Notifications />
      <MediaQuery orientation="portrait">
        <TurnPhone />
      </MediaQuery>
      <MediaQuery orientation="landscape">{appStateComponent()}</MediaQuery>
    </div>
  )
}

export default App
