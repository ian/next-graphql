import { NextApiRequest, NextApiResponse } from "next"

import { sendResult, renderGraphiQL } from "graphql-helix"

import {
  useImmediateIntrospection,
  useLogger,
  useSchema,
  useTiming,
} from "@envelop/core"
import { useResponseCache } from "@envelop/response-cache"
import { useGenericAuth, GenericAuthPluginOptions } from "@envelop/generic-auth"
import { buildServer } from "./server"
import { Config } from "./types"
import { GraphQLSchema } from "graphql"

type Options = {
  isLogger?: boolean
  isTiming?: boolean
  isImmediateIntrospection?: boolean
  isResponseCache?: boolean
  isAuth?: GenericAuthPluginOptions
  schema: GraphQLSchema
  endpoint?: string
} & Config

export default function createGraphQLHandler({
  isLogger,
  isImmediateIntrospection,
  isTiming,
  isResponseCache,
  isAuth,
  cors,
  schema,
  endpoint = "/api/graphql",
  ...serverConfig
}: Options) {
  const plugins = [
    useSchema(schema),
    ...(isLogger ? [useLogger()] : []),
    ...(isTiming ? [useTiming()] : []),
    ...(isImmediateIntrospection ? [useImmediateIntrospection()] : []),
    ...(isResponseCache ? [useResponseCache()] : []),
    ...(isAuth ? [useGenericAuth(isAuth)] : []),
  ]

  const server = buildServer({
    ...serverConfig,
    plugins,
  })

  const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (cors) {
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      )

      if (req.method == "OPTIONS") {
        res.setHeader(
          "Access-Control-Allow-Methods",
          "PUT, POST, PATCH, DELETE, GET"
        )
        return res.status(200).json({})
      }
    }

    if (req.method === "GET") {
      res.writeHead(200, {
        "content-type": "text/html",
      })
      res.end(renderGraphiQL({ endpoint }))
    } else {
      const result = await server.executeOperation(req)
      sendResult(result, res)
    }
  }

  return handler
}
