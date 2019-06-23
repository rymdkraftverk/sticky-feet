import React, { Component } from 'react'
import Notifications from 'react-notify-toast'
import MediaQuery from 'react-responsive'
import { Event, Channel } from 'common'
import getUrlParams from '../util/getUrlParams'
import signaling from 'rkv-signaling'

import channelConfigs from '../channelConfigs'
import LockerRoom from './LockerRoom'
import LockerRoomLoader from './LockerRoomLoader'
import { getLastGameCode, setLastGameCode } from '../util/sessionStorage'
import TurnPhone from './TurnPhone'

const { error: logError } = console

const { REACT_APP_WS_ADDRESS: WS_ADDRESS } = process.env
const TIMEOUT_SECONDS = 20

const AppState = {
  LOCKER_ROOM: 'locker-room',
  GAME_CONNECTING: 'game-connecting',
  GAME: 'game',
}

const errorState = message => ({
  appState: AppState.LOCKER_ROOM,
  error: message,
})

const getGameCodeFromUrl = () => getUrlParams(window.location.search).code
const writeGameCodeToUrl = gameCode => {
  window.history.pushState({ gameCode }, '', `?code=${gameCode}`)
}

const eventState = ({ event, payload }) => {
  switch (event) {
    case Event.YOU_JOINED:
      return { appState: AppState.GAME }
    default:
      return null
  }
}

class App extends Component {
  state = {
    appState: AppState.LOCKER_ROOM,
    error: '',
    gameCode: '',
    sendReliable: () => {},
  }

  componentDidMount = () => {
    this.alertIfNoRtc()
    const codeFromUrl = getGameCodeFromUrl()
    const gameCode = codeFromUrl || getLastGameCode()
    this.setState({ gameCode })
    if (codeFromUrl) {
      this.join(gameCode)
    }
  }

  onData = message => {
    const state = eventState(message)

    if (!state) {
      logError(`Unexpected event in message: ${message}`)
      return
    }

    this.setState(state)
  }

  onJoinClick = () => {
    navigator.vibrate(1) // To trigger accept dialog in firefox
    const { gameCode } = this.state
    this.join(gameCode)
  }

  join = gameCode => {
    this.setState({ appState: AppState.GAME_CONNECTING, error: '' })
    setLastGameCode(gameCode)
    setTimeout(this.checkConnectionTimeout, TIMEOUT_SECONDS * 1000)
    writeGameCodeToUrl(gameCode)
    this.connectToGame(gameCode)
  }

  displayError = message => {
    this.setState(errorState(message))
  }

  alertIfNoRtc = () => {
    if (typeof RTCPeerConnection === 'undefined') {
      const message =
        'Unfortunately the game cannot be played in this browser.' +
        'See list of supported browsers here: https://caniuse.com/#search=webrtc'

      // eslint-disable-next-line no-alert
      alert(message)
    }
  }

  gameCodeChange = ({ target: { value } }) =>
    this.setState({
      gameCode: value.substr(0, 4).toUpperCase(),
    })

  checkConnectionTimeout = () => {
    if (this.state.appState === AppState.GAME_CONNECTING) {
      this.displayError('Connection failed, joining Wi-Fi may help')
    }
  }

  connectToGame(gameCode) {
    const onClose = () => {
      this.displayError('Connection failed')
    }

    signaling
      .runInitiator({
        channelConfigs,
        onClose,
        onData: this.onData,
        receiverId: gameCode,
        wsAddress: WS_ADDRESS,
      })
      .then(send => {
        this.setState({
          sendReliable: send(Channel.RELIABLE),
        })
      })
      .catch(error => {
        const message = {
          NOT_FOUND: `Game with code ${gameCode} not found`,
        }[error.cause]

        if (message) {
          this.displayError(message)
        } else {
          logError(error)
        }
      })
  }

  clearError = () => {
    this.setState({ error: '' })
  }

  appStateComponent = () => {
    const { appState, error, gameCode } = this.state

    switch (appState) {
      case AppState.LOCKER_ROOM:
        return (
          <LockerRoom
            clearError={this.clearError}
            error={error}
            gameCodeChange={this.gameCodeChange}
            gameCode={gameCode}
            onJoinClick={this.onJoinClick}
          />
        )
      case AppState.GAME_CONNECTING:
        return <LockerRoomLoader />
      case AppState.GAME:
        return <div>GAME!</div>
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Notifications />
        <MediaQuery orientation="portrait">
          <TurnPhone />
        </MediaQuery>
        <MediaQuery orientation="landscape">
          {this.appStateComponent()}
        </MediaQuery>
      </div>
    )
  }
}

export default App
