export const getFormData = (form = {}) => {
  const urlEncodedDataPairs = Object.keys(form).reduce((acc, key) => {
    const v = form[key]
    const p = `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
    return [...acc, p]
  }, [])

  const d = urlEncodedDataPairs.join('&').replace(/%20/g, '+')
  return d
}
