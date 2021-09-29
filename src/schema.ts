import _ from "lodash"
import { applyMiddleware } from "graphql-middleware"
import { shield, deny } from "graphql-shield"

import stitch from "./transform"
import { Config } from "./types"
import { guardsMiddleware } from "./guards"

export async function buildSchema(opts: Config) {
  const {
    schemas,
    extensions,
    guards: optsGuards,
    middleware: optsMiddleware,
  } = opts
  const subschemas = await allPromiseValues(schemas)

  const typeDefs = []
  const resolvers = {}
  const middleware = []
  const guards = {}

  if (optsGuards) _.merge(guards, optsGuards)
  if (optsMiddleware) middleware.push(optsMiddleware)

  extensions?.forEach((extension) => {
    const extended = extension(subschemas)
    if (extended.typeDefs) typeDefs.push(extended.typeDefs)
    if (extended.resolvers) _.merge(resolvers, extended.resolvers)
    if (extended.middleware) middleware.push(extended.middleware)
    // For now we're not going to support extension guards. Maybe in the future we will
    // if (extended.guards) _.merge(guards, extended.guards)
  })

  middleware.push(guardsMiddleware(guards))

  const stitchableExtensions = {
    typeDefs: typeDefs.join("\n"),
    resolvers,
  }

  const schema = stitch(Object.values(subschemas), stitchableExtensions)

  return applyMiddleware(schema, ...middleware.flat())
}

const allPromiseValues = async (object) => {
  return _.zipObject(_.keys(object), await Promise.all(_.values(object)))
}
