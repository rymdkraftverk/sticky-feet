import { createRoot } from 'react-dom/client'
import { createGlobalStyle } from 'styled-components'
import { prettyVersionTime } from 'common'
import Shake from 'shake.js'
import Boundary from './Boundary'
import App from './App'

const version = process.env.REACT_APP_VERSION

if (version) {
  console.log(`Version: ${version} | Time: ${prettyVersionTime(version)}`)
}

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'patchy-robots';
    src: url('/patchy-robots.ttf');
  }

  html {
    /* This is needed to prevent double tap zoom on iOS Safari */
    touch-action: manipulation;
  }

  input {
    user-select: text;
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
const myShakeEvent = new Shake({
  threshold: 5,
  timeout: 1000,
})
myShakeEvent.start()

// Prevent displaying "undo text" dialog on iOS when device is accidentally shaken
// This probably does not work though
window.addEventListener('devicemotion', e => {
  e.preventDefault()
})

const container = document.getElementById('root')

if (!container) {
  throw new Error('Found no #root element to mount into')
}

createRoot(container).render(
  <Boundary>
    <GlobalStyle />
    <App />
  </Boundary>,
)
