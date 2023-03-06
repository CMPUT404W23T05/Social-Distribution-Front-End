export function errorFromResponse (response) {
  if (response.status === 400) {
    const data = response.data
    const formattedFieldNames = { username: 'Username', password: 'Password', non_field_errors: 'Login error' }
    const allErrors = Object.keys(data).reduce((acc, key) => {
      return acc.concat(formattedFieldNames[key] + ': ' + data[key].join('\n'))
    }, [])
    return allErrors.join('\n\n')
  }
}
