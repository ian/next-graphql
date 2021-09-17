import { GraphQLSchema, printSchema } from "graphql"
import { GraphQLRequest } from "apollo-server-types"
import { Server } from "../src/types"
import { buildServer } from "../src/server"

type TestServer = {
  server: Server
  schema: GraphQLSchema
  typeDefs: string
  graphql: (query: string, vars?: object, http?: GraphQLRequest['http']) => any
}

async function testServer(config): Promise<TestServer> {
  const server = await buildServer(config)
  const { schema } = server
  const typeDefs = printSchema(schema)
  const graphql = async (query, variables, http) => server.executeOperation({ query, variables, http })

  return new Promise((resolve) => {
    return resolve({ server, schema, typeDefs, graphql })
  }).finally(() => {
    server.stop()
  }) as Promise<TestServer>
}

export default testServer