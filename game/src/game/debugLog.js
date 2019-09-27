export default (...args) => {
  if (window['debug'].logging) {
    console.log(...args)
  }
}
