import { ApolloServer } from "apollo-server-micro"
import { buildSchema } from "./schema"
import { Config } from "./types"

export default function nextGraphQL(config: Config = {}) {
  const { schemas, extensions = [] } = config

  return async function handler(req, res) {
    if (req.method === "POST") {
      const schema = await buildSchema({ schemas, extensions })
      const apolloServer = new ApolloServer({
        schema,
        logger: console,
        introspection: true,
        context: ({ req, res }) => ({ req, res })
        // introspection: process.env.NODE_ENV === "development"
      })

      await apolloServer.start()
      const handler = apolloServer.createHandler({
        path: "/api/graphql",
      })
      
      await handler(req, res)
    } else {
      res.send("next-graphql - WIP")
    }
  }
}
