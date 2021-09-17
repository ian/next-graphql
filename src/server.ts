import { ApolloServer } from "apollo-server-micro"
import { Config } from "./types"
import { buildSchema } from "./schema"

export async function buildServer(config: Config): Promise<ApolloServer> {
  const schema = await buildSchema(config)
  const server = new ApolloServer({
    schema,
    logger: console,
    introspection: true,
    context: ({ req, res }) => ({ req, res }),
    stopOnTerminationSignals: true,
    // introspection: process.env.NODE_ENV === "development"
  })
  server['schema'] = schema

  await server.start()
  return server
}