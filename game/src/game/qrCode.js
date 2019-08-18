import QRCode from 'qrcode'

const ELEMENT_ID = 'qr-code'

const hide = () => {
  const element = document.getElementById(ELEMENT_ID)
  if (element) element.remove()
}

const display = (controllerHost, gameCode) => {
  const url = `http://${controllerHost}/?code=${gameCode}`
  QRCode.toCanvas(
    url,
    {
      color: {
        dark: '#000000',
      },
      margin: 1,
    },
    (_error, qrElement) => {
      qrElement.setAttribute('id', ELEMENT_ID)

      document
        .getElementById('game')
        .appendChild(qrElement)
    },
  )
}

export default {
  hide,
  display,
}
