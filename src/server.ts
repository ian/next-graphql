import { ApolloServer } from "apollo-server-micro"
import { Config, Server } from "./types"
import { buildSchema } from "./schema"

export async function buildServer(config: Config): Promise<Server> {
  const schema = await buildSchema(config)
  const server = new ApolloServer({
    schema,
    logger: console,
    introspection: true,
    context: ({ req, res }) => ({ req, res }),
    stopOnTerminationSignals: true,
    // introspection: process.env.NODE_ENV === "development"
  })

  await server.start()

  // @ts-ignore
  server.schema = schema
  // @ts-ignore
  return server
}