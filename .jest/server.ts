import { GraphQLSchema, printSchema } from "graphql"
import { Server } from "../src/types"
import { buildServer } from "../src/server"

type TestServer = {
  server: Server
  schema: GraphQLSchema
  typeDefs: string
  graphql: (query: string, vars?: object) => any
}

async function testServer(config): Promise<TestServer> {
  const server = await buildServer(config)
  const { execute, schema } = server
  const typeDefs = printSchema(schema)
  const graphql = async (document, variables) => execute({ document, variables })
  
  return new Promise((resolve) => {
    return resolve({ server, schema, typeDefs, graphql })
  })
}

export default testServer 