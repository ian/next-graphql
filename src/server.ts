import Fastify, { FastifyInstance } from "fastify"
import cors from "fastify-cors"
import mercurius from "mercurius"

import { Config, Server } from "./types"
import { buildSchema } from "./schema"

export async function buildServer(config: Config): Promise<FastifyInstance> {
  const schema = await buildSchema(config)
  const fastify = Fastify()
  const { path = "/api/graphql" } = config

  fastify
    .register(mercurius, {
      path,
      schema,
      // resolvers,
      context: async (req, res) => {
        const context = { req, res }
        if (config.session) {
          Object.assign(context, { session: await config.session({ req }) })
        }
        return context
      },
    })

    .register(require("fastify-nextjs"))
    .after((error) => {
      // app.next("/hello")
      // @ts-ignore
      fastify.next("/api/*", { method: "GET" })
      // @ts-ignore
      fastify.next("/api/*", { method: "POST" })
    })

  fastify.register(cors, {
    origin: "*",
  })

  if (process.env.GRAPHQL_LOGGING) {
    fastify.graphql.addHook(
      "onResolution",
      async function (execution, context) {
        // console.log('onResolution called', context.reply.raw, context.reply.request)
        const { query, variables } = context.reply.request.body as {
          query: string
          variables: object
        }

        // if (query.match('query IntrospectionQuery')) return

        console.log()
        console.log(query.trim())
        console.log(JSON.stringify(variables, null, 2))
        console.log(JSON.stringify(execution, null, 2))
        console.log()
      }
    )
  }

  await fastify.ready()

  // @ts-ignore
  app.schema = schema

  // @ts-ignore
  return app
}
