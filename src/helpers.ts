import _ from "lodash"

export function exceptTypes(...types) {
  const aryTypes = Array(types).flat()
  return (type) => !matches(type, aryTypes)
}

export function exceptFields(pairs) {
  return (type, field) => {
    if (pairs[type]) {
      return !matches(field, Array(pairs[type]).flat())
    }
    return true
  }
}

export function onlyTypes(...types) {
  const aryTypes = Array(types).flat()
  return (type) => matches(type, aryTypes)
}

export function onlyFields(pairs) {
  return (type, field) => {
    if (pairs[type]) {
      return matches(field, Array(pairs[type]).flat())
    }
    return false
  }
}

function matches(name, allowed) {
  return _.find(allowed, match => {
    return !!name.match(`^${match}$`)
  })
}