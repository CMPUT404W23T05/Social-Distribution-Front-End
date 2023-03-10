export function errorToString (error, formattedFieldNames) {
  if ('response' in error) {
    const response = error.response
    if (response.status === 400) {
      const data = response.data
      const allErrors = Object.keys(data).reduce((acc, key) => {
        return acc.concat(formattedFieldNames[key] + ': ' + data[key].join('\n'))
      }, [])
      return allErrors.join('\n\n')
    } else {
      return response.statusText
    }
  } else {
    return error.message
  }
}
