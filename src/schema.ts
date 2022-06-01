import { applyMiddleware } from "graphql-middleware"
import { makeExecutableSchema } from "@graphql-tools/schema"
import _ from "lodash"

import { guardsMiddleware } from "./guards"
import { BuildSchemaConfig, ExtendSchemaConfig } from "./types"

export function buildSchema(opts: BuildSchemaConfig) {
  const { typeDefs, resolvers } = opts

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })

  return schema
}

export function extendSchema(opts: ExtendSchemaConfig) {
  const { schema, guards: optsGuards, middleware: optsMiddleware } = opts
  const middleware = []
  const guards = {}

  if (optsGuards) _.merge(guards, optsGuards)
  if (optsMiddleware) middleware.push(optsMiddleware)

  middleware.push(guardsMiddleware(guards))

  return applyMiddleware(schema, ...middleware.flat())
}
