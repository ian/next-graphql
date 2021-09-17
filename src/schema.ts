import _ from "lodash"
import { applyMiddleware } from "graphql-middleware"

import stitch from "./stitch"
// import { shield } from "./guards"
import { Config } from "./types"

export async function buildSchema(opts: Config) {
  const { schemas, extensions } = opts
  const subschemas = await Promise.all(Object.values(schemas))
  
  const typeDefs = []
  const resolvers = {}
  const middleware = []
  const guards = {}

  extensions?.forEach(extension => {
    const extended = extension(schemas)
    if (extended.typeDefs) typeDefs.push(extended.typeDefs)
    _.merge(resolvers, extended.resolvers)
    _.merge(guards, extended.guards)
    if (extended.middleware) middleware.push(extended.middleware)
  })

  const stitchableExtensions = {
    typeDefs: typeDefs.join("\n"),
    resolvers
  }

  const schema = stitch(subschemas, stitchableExtensions)
  const schemaWithMiddleware = applyMiddleware(
    schema,
    // shield(guards),
    ...middleware.flat()
  )

  return schemaWithMiddleware
}
