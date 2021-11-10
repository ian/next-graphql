import _ from "lodash"
import { applyMiddleware } from "graphql-middleware"

import stitch from "./transform"
import { Config } from "./types"
import { guardsMiddleware } from "./guards"

export async function buildSchema(opts: Config) {
  const {
    schema,
    remotes,
    guards: optsGuards,
    middleware: optsMiddleware,
  } = opts
  const remoteSchemas = await allPromiseValues(remotes)

  const typeDefs = []
  const resolvers = {}
  const middleware = []
  const guards = {}

  if (optsGuards) _.merge(guards, optsGuards)
  if (optsMiddleware) middleware.push(optsMiddleware)

  if (schema) {
    Array(schema)
      .flat()
      .forEach((schema) => {
        if (schema.typeDefs) typeDefs.push(schema.typeDefs)
        if (schema.resolvers) _.merge(resolvers, schema.resolvers)
        if (schema.middleware) middleware.push(schema.middleware)
        // For now we're not going to support schema guards. Maybe in the future we will
        // if (extended.guards) _.merge(guards, extended.guards)
      })
  }

  // middleware.push(guardsMiddleware(guards))

  const stitchableExtensions = {
    typeDefs: typeDefs.join("\n"),
    resolvers,
  }

  const stitched = stitch(Object.values(remoteSchemas), stitchableExtensions)

  return applyMiddleware(stitched, ...middleware.flat())
}

const allPromiseValues = async (object) => {
  return _.zipObject(_.keys(object), await Promise.all(_.values(object)))
}
