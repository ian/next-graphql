import _ from "lodash"
import { applyMiddleware } from "graphql-middleware"

import { SchemaConfig } from "./types"
import { guardsMiddleware } from "./guards"

export function buildSchema(opts: SchemaConfig) {
  const {
    schema,
    guards: optsGuards,
    middleware: optsMiddleware,
  } = opts
  const middleware = []
  const guards = {}

  if (optsGuards) _.merge(guards, optsGuards)
  if (optsMiddleware) middleware.push(optsMiddleware)

  middleware.push(guardsMiddleware(guards))

  return applyMiddleware(schema, ...middleware.flat())
}