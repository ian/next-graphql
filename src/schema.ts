import { applyMiddleware } from "graphql-middleware"
import _ from "lodash"

import { guardsMiddleware } from "./guards"
import { SchemaConfig } from "./types"

export function buildSchema(opts: SchemaConfig) {
  const { schema, guards: optsGuards, middleware: optsMiddleware } = opts
  const middleware = []
  const guards = {}

  if (optsGuards) _.merge(guards, optsGuards)
  if (optsMiddleware) middleware.push(optsMiddleware)

  middleware.push(guardsMiddleware(guards))

  return applyMiddleware(schema, ...middleware.flat())
}
