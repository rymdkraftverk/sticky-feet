export default (): Record<string, string> => {
  const query = window.location.search

  if (!query) {
    return {}
  }

  return Object.fromEntries(
    (/^[?#]/.test(query) ? query.slice(1) : query).split('&').map(param => {
      const [key, value] = param.split('=')
      return [key, value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '']
    }),
  )
}
