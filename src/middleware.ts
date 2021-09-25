export const addToContext = (params) => {
  return async (resolve, parent, args, context, info) => {
    return resolve(parent, args, { ...context, ...params }, info)
  }
}

export const addSessionToContext = (session) => {
  return async (resolve, parent, args, context, info) => {
    return resolve(parent, args, { ...context, session }, info)
  }
}
