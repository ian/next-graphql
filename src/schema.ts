import _ from "lodash"
import { applyMiddleware } from "graphql-middleware"

import stitch from "./stitch"
import { Config } from "./types"
// import { shield } from "./guards"

export async function buildSchema(opts: Config) {
  const { schemas, extensions } = opts
  const subschemas = await allPromiseValues(schemas)
  
  const typeDefs = []
  const resolvers = {}
  const middleware = []
  const guards = {}

  extensions?.forEach(extension => {
    const extended = extension(subschemas)
    if (extended.typeDefs) typeDefs.push(extended.typeDefs)
    _.merge(resolvers, extended.resolvers)
    _.merge(guards, extended.guards)
    if (extended.middleware) middleware.push(extended.middleware)
  })

  const stitchableExtensions = {
    typeDefs: typeDefs.join("\n"),
    resolvers
  }

  const schema = stitch(Object.values(subschemas), stitchableExtensions)
  const schemaWithMiddleware = applyMiddleware(
    schema,
    // shield(guards),
    ...middleware.flat()
  )

  return schemaWithMiddleware
}

const allPromiseValues = async (object) => {
  return _.zipObject(_.keys(object), await Promise.all(_.values(object)))
}