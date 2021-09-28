import _ from "lodash"

export function exceptTypes(...types) {
  const aryTypes = Array(types).flat()
  return (type) => !matchesType(type, aryTypes)
}

export function exceptFields(pairs) {
  return (type, field) => {
    if (pairs[type]) {
      const fields = Array(pairs[type]).flat()
      if (fields.includes(field)) return false
    }
    return true
  }
}

export function onlyTypes(...types) {
  const aryTypes = Array(types).flat()
  return (type) => matchesType(type, aryTypes)
}

function matchesType(type, allowedTypes) {
  return _.find(allowedTypes, allowed => {
    return !!type.match(`^${allowed}$`)
  })
}