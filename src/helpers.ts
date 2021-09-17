export function exceptTypes(types) {
  const aryTypes = Array(types)
  return (type) => !(aryTypes.includes(type))
}

export function exceptFields(pairs) {
  return (type, field) => {
    if (pairs[type]) {
      const fields = Array(pairs[type])
      if (fields.includes(field)) return false
    }
    return true
  }
}