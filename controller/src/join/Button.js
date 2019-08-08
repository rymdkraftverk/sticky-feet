import styled from 'styled-components'

export default styled.button`
  padding: 8px;
  box-shadow: 0.1em 0.1em 0 0 black;
  outline: none;
  color: black;
  letter-spacing: 0.1em;
  font-size: 8vw;
  background: transparent;
  font-family: 'patchy-robots';
  border: 0.1em solid #4085af;
  border-radius: 0.12em;
  transition: all ease 0.05s;
  position: relative;
  top: 0;
  left: 0;

  :active {
    box-shadow: 0 0;
    top: 0.1em;
    left: 0.1em;
  }
`
