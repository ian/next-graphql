import { GraphQLSchema, printSchema } from "graphql"
import buildServer from "./server"
import { buildSchema } from "./schema"
import { createMocks } from "node-mocks-http"
import type { NextApiRequest, NextApiResponse } from "next"

type TestServer = {
  server: any
  schema: GraphQLSchema
  typeDefs: string
  graphql: (query: string, vars?: object) => any
}

type TestConfig = {
  typeDefs: string
  resolvers: any
}

function testServer(config: TestConfig): TestServer {
  const { typeDefs, resolvers, ...restConfig } = config

  console.log({ config })

  const schema = buildSchema({ typeDefs, resolvers })
  const server = buildServer({ ...restConfig, schema })
  // const typeDefs = printSchema(config.schema)
  const graphql = async (document, variables) => {
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      createMocks({
        method: "POST",
        path: "/graphql",
        body: { document, variables },
        headers: { "Content-Type": "application/json" },
      })

    // console.log({ req, res })
    console.log({
      document,
      variables,
      // ...config,
    })

    server
      .inject({
        document,
        variables,
        // operationName: "sdfjklsdfsdjfkl",
        headers: { "Content-Type": "application/json" },
        serverContext: { req, res },
      })
      // .inject()
      .then((res) => JSON.stringify(res.executionResult, null, 2))
      // .then((res) => res.text())
      .then(console.log)
  }

  return {
    server,
    schema,
    typeDefs,
    graphql,
  }

  // server.handleRequest(req, ctx)
  // console.log(server)
  // const { execute, schema } = server
  // const typeDefs = printSchema(schema)
  // const graphql = async (document, variables) =>
  //   execute({ document, variables })

  // return new Promise((resolve) => {
  //   return resolve({ server, schema, typeDefs, graphql })
  // })
}

export default testServer
