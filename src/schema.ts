import { applyMiddleware } from "graphql-middleware"

import { authMiddleware } from "./auth"
import stitch from "./stitch"
import { shield } from "./guards"

export async function buildSchema(opts) {
  const { schemas, extensions } = opts
  const subschemas = await Promise.all(Object.values(schemas))

  const typeDefs = []
  const resolvers = {}
  const middleware = {}
  const guards = {}

  extensions.forEach(extension => {
    const extended = extension(schemas)
    typeDefs.push(extended.typeDefs)
    // deepmerge ?!?
    Object.assign(resolvers, extended.resolvers)
    Object.assign(middleware, extended.middleware)
    Object.assign(guards, extended.guards)
  })

  const stitchableExtensions = {
    typeDefs: typeDefs.join("\n"),
    resolvers
  }

  const schema = stitch(subschemas, stitchableExtensions)
  const schemaWithMiddleware = applyMiddleware(
    schema,
    authMiddleware,
    shield(guards),
    middleware
  )

  return schemaWithMiddleware
}
