import { useEffect, useRef } from 'react'

export default callback => {
  const savedCallback = useRef()

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up event listener
  useEffect(() => {
    const handleShake = e => {
      savedCallback.current(e)
    }
    window.addEventListener('shake', handleShake, true)
    return () => {
      window.removeEventListener('shake', handleShake, true)
    }
  }, [])
}
