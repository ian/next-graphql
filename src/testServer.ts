import { GraphQLSchema, printSchema } from "graphql"
import buildServer from "./server"
import { createMocks } from "node-mocks-http"
import type { NextApiRequest, NextApiResponse } from "next"

type TestServer = {
  server: any
  schema: GraphQLSchema
  typeDefs: string
  graphql: (query: string, vars?: object) => any
}

function testServer(config): TestServer {
  const { schema } = config
  console.log({ config })
  const server = buildServer(config)
  const typeDefs = printSchema(config.schema)
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
