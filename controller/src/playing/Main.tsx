import { useState } from 'react'
import { Event } from 'common'
import styled, { css } from 'styled-components'
import FullHeight from '../FullHeight'
import IOSDisableDoubleTap from '../util/IOSDisableDoubleTap'
import ScrollLock from '../util/ScrollLock'
import useShake from '../useShake'

const Container = styled(FullHeight)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--player-color);
`

const panel = css`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const JumpPanel = styled.div`
  ${panel};
  width: 40vw;
`

const ShootPanel = styled.div`
  ${panel};
  width: 100%;
`

const VerticalSeparator = styled.div`
  height: 100%;
  width: 1vw;
  background: black;
`

type Position = { x: number; y: number }

const distance = ({ x: x1, y: y1 }: Position, { x: x2, y: y2 }: Position) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

const angle = ({ x: x1, y: y1 }: Position, { x: x2, y: y2 }: Position) =>
  Math.atan2(y2 - y1, x2 - x1)

const touchEventPosition = ({
  targetTouches,
}: React.TouchEvent<HTMLDivElement>): Position => ({
  x: targetTouches[0].clientX,
  y: targetTouches[0].clientY,
})

function GamePlaying({
  send,
  playerColor,
}: {
  send: (message: object) => void
  playerColor: string
}) {
  const [originPosition, setOriginPosition] = useState<Position | null>(null)
  const [position, setPosition] = useState<Position | null>(null)
  const [braking, setBraking] = useState(false)

  useShake(() => {
    send({ event: Event.ToGame.SHAKE })
  })

  const sendDrag = (pos: Position) => {
    if (!originPosition) return

    setPosition(pos)
    send({
      event: Event.ToGame.DRAG,
      payload: {
        angle: angle(originPosition, pos),
        distance: distance(originPosition, pos),
      },
    })
  }

  const sendDragEnd = () => {
    if (!originPosition || !position) return

    send({
      event: Event.ToGame.DRAG_END,
      payload: {
        angle: angle(originPosition, position),
      },
    })

    setOriginPosition(null)
    setPosition(null)
  }

  const sendBrake = () => {
    setBraking(true)
    send({ event: Event.ToGame.BRAKE })
  }

  const sendJump = () => {
    setBraking(false)
    send({ event: Event.ToGame.JUMP })
  }

  return (
    <IOSDisableDoubleTap>
      <Container style={{ '--player-color': playerColor }}>
        <ScrollLock />
        <JumpPanel onTouchStart={sendBrake} onTouchEnd={sendJump}>
          {braking ? 'Jump' : 'Brake'}
        </JumpPanel>
        <VerticalSeparator />
        <ShootPanel
          onTouchStart={event => setOriginPosition(touchEventPosition(event))}
          onTouchMove={event => sendDrag(touchEventPosition(event))}
          onTouchEnd={() => {
            sendDragEnd()
          }}
        >
          Drag to shoot
        </ShootPanel>
      </Container>
    </IOSDisableDoubleTap>
  )
}

export default GamePlaying
