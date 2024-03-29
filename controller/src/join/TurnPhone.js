import React, { useEffect } from 'react'
import styled from 'styled-components/macro'
import Div100vh from 'react-div-100vh'
import turnPhoneGifPath from './turnPhone.gif'
import turnPhoneSoundPath from './key.mp3'

const turnPhoneSound = new Audio(turnPhoneSoundPath)

const Content = styled.div`
  color: white;
  text-align: center;
  margin-bottom: auto;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const PageContainer = styled(Div100vh)`
  display: flex;
  flex-direction: column;
`

const GIF = styled.img`
  width: 100vw;
  height: auto;
  margin-bottom: -80px;
  margin-top: -200px;
`

const TurnPhone = props => {
  useEffect(
    () => () => {
      turnPhoneSound.play().catch(error => {
        console.error('Turn phone sound failed: ', error)
      })
    },
    [],
  )

  return (
    <PageContainer>
      <Content>
        <GIF src={turnPhoneGifPath} />
        <div>Please turn your phone to landscape</div>
      </Content>
    </PageContainer>
  )
}

TurnPhone.propTypes = {}

export default TurnPhone
