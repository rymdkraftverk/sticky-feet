import React from 'react'
import ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components/macro'
import Boundary from './Boundary'
import App from './App'

const VERSION = process.env.REACT_APP_VERSION || 'N/A'

console.log(`Version: ${VERSION}`)

/* eslint-disable-next-line no-unused-expressions */
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'patchy-robots';
    src: url('patchy-robots.ttf');
  }

  html {
    /* This is needed to prevent double tap zoom on iOS Safari */
    touch-action: manipulation;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'patchy-robots';
    background: #414844;
  }

  .fullscreen-enabled {
    background-color: #414844;
  }

  * {
    user-select: none;
  }
`

// Prevent displaying "undo text" dialog on iOS when device is accidentally shaken
window.addEventListener('devicemotion', e => {
  e.preventDefault()
})

ReactDOM.render(
  <Boundary>
    <GlobalStyle />
    <App />
  </Boundary>,
  document.getElementById('root'),
)
